const fs = require("fs");

function getFileDependencies(pathMap) {
	return Object.keys(pathMap)
		.map(key => [key, "app/" + pathMap[key]])
		.reduce((prev, keyPath) => {
			const key = keyPath[0];
			const path = keyPath[1];

			var dependencyName = path.replace(/@VERSION.*/, "");
			var parentPath = dependencyName.replace(/[^\/]*$/, "");
			var namePrefix = dependencyName.replace(parentPath,"");
			var matchingFolders = fs.readdirSync(parentPath)
									.filter(name => name.startsWith(`${namePrefix}@`))
									.filter(name => fs.lstatSync(`${parentPath}/${name}`).isDirectory());

			if (matchingFolders.length <= 0) {
				console.warn("Couldn't find a single match for '" + path + "' in " + parentPath);
				return prev;
			}
			return Object.assign({}, prev, { [key]: `file:../${path.replace(/VERSION/, matchingFolders[0].replace(/.*@/,""))}` });
		}, { });
}

const typingsDependencies = (JSON.parse(fs.readFileSync("package.json")).typingsDependencies || { });
const repo = Object.assign({ dependencies: {}, globalDependencies: {} }, typingsDependencies.repo || { });
const extension = {
	globalDependencies: (typingsDependencies && typingsDependencies.files && getFileDependencies(typingsDependencies.files.globalDependencies || { })) || { },
	dependencies: (typingsDependencies && typingsDependencies.files && getFileDependencies(typingsDependencies.files.dependencies || { })) || { }
};
const result = {
	globalDependencies: Object.assign({ }, repo.globalDependencies, extension.globalDependencies),
	dependencies: Object.assign({ }, repo.dependencies, extension.dependencies)
};

fs.writeFile("app/typings.json", JSON.stringify(result, null, 4));
