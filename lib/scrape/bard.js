const fetch = require('node-fetch');

class Bard {
  static JSON = "json";
  static MD = "markdown";

  #headers; // HTTPS Headers
  #initPromise; // Resolution status of initialization call
  #bardURL = "https://gemini.google.com"; // Base URL for Bard
  #verbose = false; // Whether or not to log events to console
  #fetch = fetch; // Fetch function

  constructor(cookie, config) {
    // Initialize Bard instance
    if (cookie) {
      this.#initPromise = this.#init(cookie);
    } else {
      throw new Error("Please provide a Cookie when initializing Bard.");
    }
    this.cookie = cookie;
    // Configure Bard settings
    if (config?.verbose === true) {
      this.#verbose = true;
    }
    if (config?.fetch) {
      this.#fetch = config.fetch;
    }
  }

  // Initialize Bard
  async #init(cookie) {
    // Set up HTTPS headers
    this.#headers = {
      Host: "gemini.google.com",
      "X-Same-Domain": "1",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      Origin: this.#bardURL,
      Referer: this.#bardURL,
      Cookie: typeof cookie === "object" ? Object.entries(cookie).map(([key, val]) => `${key}=${val};`).join("") : "__Secure-1PSID=" + cookie,
    };

    try {
      // Authenticate and retrieve SNlM0e
      const responseText = await this.#fetch(this.#bardURL, { method: "GET", headers: this.#headers, credentials: "include" }).then((response) => response.text());
      const SNlM0e = responseText.match(/SNlM0e":"(.*?)"/)[1];
      this.SNlM0e = SNlM0e;
      return SNlM0e;
    } catch {
      throw new Error("Could not use your Cookie. Make sure that you copied correctly the Cookie with name __Secure-1PSID exactly. If you are sure your cookie is correct, you may also have reached your rate limit.");
    }
  }

  // Upload image to Bard
  async #uploadImage(name, buffer) {
    let size = buffer.byteLength;
    let formBody = [`File name=${encodeURIComponent(name)}`];

    try {
      // Start the upload process
      let response = await this.#fetch("https://content-push.googleapis.com/upload/", { method: "POST", headers: { "X-Goog-Upload-Command": "start", "X-Goog-Upload-Protocol": "resumable", "X-Goog-Upload-Header-Content-Length": size, "X-Tenant-Id": "bard-storage", "Push-Id": "feeds/mcudyrk2a4khkz", }, body: formBody, credentials: "include" });
      const uploadUrl = response.headers.get("X-Goog-Upload-URL");
      // Upload image data
      response = await this.#fetch(uploadUrl, { method: "POST", headers: { "X-Goog-Upload-Command": "upload, finalize", "X-Goog-Upload-Offset": 0, "X-Tenant-Id": "bard-storage", }, body: buffer, credentials: "include" });
      const imageFileLocation = await response.text();
      return imageFileLocation;
    } catch (e) {
      throw new Error("Could not fetch Google Bard. You may be disconnected from the internet: " + e);
    }
  }

  // Query Bard for a response
  async #query(message, config) {
    function formatMarkdown(text, images) {
      if (images) return text;
      for (let imageData of images) {
        const formattedTag = `!${imageData.tag}(${imageData.url})`;
        text = text.replace(new RegExp(`(?!\\!)\\[${imageData.tag.slice(1, -1)}\\]`), formattedTag);
      }
      return text;
    }
    // Wait until initialization is complete
    await this.#initPromise;

    // Prepare HTTPS parameters
    const params = { bl: "boq_assistant-bard-web-server_20230711.08_p0", _reqID: config.ids?._reqID ?? "0", rt: "c" };

    const messageStruct = [[message], null, [null, null, null]];

    if (config.imageBuffer) {
      let imageLocation = await this.#uploadImage(`bard-ai_upload`, config.imageBuffer);
      messageStruct[0].push(0, null, [[[imageLocation, 1], "bard-ai_upload"]]);
    }

    if (config.ids) {
      const { conversationID, responseID, choiceID } = config.ids;
      messageStruct[2] = [conversationID, responseID, choiceID];
    }

    // Prepare HTTP data
    const data = { "f.req": JSON.stringify([null, JSON.stringify(messageStruct)]), at: this.SNlM0e };

    // Construct URL for Bard query
    const url = new URL("/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate", this.#bardURL);
    
    for (const key in params) url.searchParams.append(key, params[key]);
    const formBody = Object.entries(data).map(([property, value]) => `${encodeURIComponent(property)}=${encodeURIComponent(value)}`).join("&");

    // Send query to Bard and parse the response
    const chatData = await this.#fetch(url.toString(), { method: "POST", headers: this.#headers, body: formBody, credentials: "include" }).then((response) => response.text()).then((text) => JSON.parse(text.split("\n")[3])[0][2]).then((rawData) => JSON.parse(rawData));
    
    const answer = chatData[4][0];
    const text = answer[1][0];
    const images = answer[4]?.map((x) => ({ tag: x[2], url: x[3][0][0], info: { raw: x[0][0][0], source: x[1][0][0], alt: x[0][4], website: x[1][1], favicon: x[1][3], }, })) ?? [];

    return {
      content: formatMarkdown(text, images),
      images: images,
      ids: { conversationID: chatData[1][0], responseID: chatData[1][1], choiceID: answer[0], _reqID: String(parseInt(config.ids?._reqID ?? 0) + 100000), },
    };
  }

  // Parse configuration options
  async #parseConfig(config) {
    let result = { useJSON: false, imageBuffer: undefined, ids: undefined, };

    if (config?.format) {
      switch (config.format) {
        case Bard.JSON: result.useJSON = true; break;
        case Bard.MD: result.useJSON = false; break;
        default: throw new Error("Format can only be Bard.JSON for JSON output or Bard.MD for Markdown output.");
      }
    }

    if (config?.image) {
      result.imageBuffer = config.image;
    }

    if (config?.ids) {
      if (config.ids.conversationID && config.ids.responseID && config.ids.choiceID && config.ids._reqID) {
        result.ids = config.ids;
      } else {
        throw new Error("Please provide the IDs exported exactly as given.");
      }
    }
    return result;
  }

  // Ask Bard a question
  async ask(message, config) {
    let { useJSON, imageBuffer, ids } = await this.#parseConfig(config);
    let response = await this.#query(message, { imageBuffer, ids });
    return useJSON ? response : response.content;
  }

  // Create a new Bard chat session
  createChat(ids) {
    let bard = this;
    class Chat {
      ids = ids;

      async ask(message, config) {
        let { useJSON, imageBuffer } = await bard.#parseConfig(config);
        let response = await bard.#query(message, { imageBuffer, ids: this.ids });
        this.ids = response.ids;
        return useJSON ? response : response.content;
      }

      export() {
        return this.ids;
      }
    }

    return new Chat();
  }
}

module.exports = Bard;
