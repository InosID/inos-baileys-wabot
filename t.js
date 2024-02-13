// (async function(directory: string): Promise<void> {
//   try {
//     const pathDir = path.join(__dirname, directory);
//     const features = fs.readdirSync(pathDir);
//     console.log("Loading... Please wait while the system checks the commands.");
//     for (const feature of features) {
//       const commands = fs.readdirSync(path.join(pathDir, feature)).filter((file) => file.endsWith(".js"));
//       for (const file of commands) {
//         const command: Command = require(path.join(pathDir, feature, file));
//         if (typeof command.run !== "function") continue;
//         const defaultCmdOptions = {
//           name: "command",
//           alias: [""],
//           desc: "",
//           use: "",
//           example: "",
//           url: "",
//           category: command.category === undefined ? "" : feature.toLowerCase(),
//           wait: false,
//           isOwner: false,
//           isAdmin: false,
//           isQuoted: false,
//           isGroup: false,
//           isBotAdmin: false,
//           isQuery: false,
//           isPrivate: false,
//           isUrl: false,
//           run: () => {},
//         };
//         const cmdOptions = parseOptions(defaultCmdOptions, command);
//         const options = Object.fromEntries(
//           Object.entries(cmdOptions)
//             .filter(([k, v]) => typeof v === "boolean" || k === "query" || k === "isMedia")
//         );
//         const cmdObject: Command = {
//           name: cmdOptions.name,
//           alias: cmdOptions.alias,
//           desc: cmdOptions.desc,
//           use: cmdOptions.use,
//           type: cmdOptions.type || "",
//           example: cmdOptions.example,
//           url: cmdOptions.url,
//           category: cmdOptions.category,
//           options,
//           run: cmdOptions.run,
//         };
//         attr.command.set(cmdOptions.name, cmdObject);
//         global.reloadFile(`./${directory}/${feature}/${file}`);
//       }
//     }
//     console.log("Loading... Command loaded successfully.");
//   } catch (error) {
//     console.error("Error: ", error);
//   }
// })('../commands');