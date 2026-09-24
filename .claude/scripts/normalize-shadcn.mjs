#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, renameSync, rmdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
const componentsDir = join(root, 'src/presentation/components');

function toPascalCase(fileName) {
	return fileName
		.split('-')
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join('');
}

function findGeneratedFiles(dir) {
	if (!existsSync(dir)) {
		return [];
	}

	return readdirSync(dir, { withFileTypes: true })
		.filter((entry) => entry.isFile() && entry.name.endsWith('.tsx'))
		.map((entry) => ({ dir, name: entry.name }));
}

const generated = [
	...findGeneratedFiles(componentsDir),
	...findGeneratedFiles(join(componentsDir, 'ui'))
];

if (generated.length === 0) {
	process.exit(0);
}

const moved = [];
const reinstalled = [];

for (const file of generated) {
	const componentName = toPascalCase(file.name.replace(/\.tsx$/, ''));
	const targetDir = join(componentsDir, componentName);
	const targetFile = join(targetDir, `${componentName}.tsx`);

	if (existsSync(targetFile)) {
		reinstalled.push(componentName);
	}

	mkdirSync(targetDir, { recursive: true });
	renameSync(join(file.dir, file.name), targetFile);
	moved.push({ from: file.name, to: relative(root, targetFile), componentName });
}

const uiDir = join(componentsDir, 'ui');

if (existsSync(uiDir) && readdirSync(uiDir).length === 0) {
	rmdirSync(uiDir);
}

try {
	execFileSync('pnpm', ['exec', 'biome', 'check', '--write', ...moved.map((file) => file.to)], {
		cwd: root,
		stdio: 'ignore'
	});
} catch {}

const movedList = moved.map((file) => `- \`${file.from}\` → \`${file.to}\``).join('\n');
const reinstallWarning = reinstalled.length
	? `\n\nReinstalação detectada (${reinstalled.join(', ')}): o \`.tsx\` foi sobrescrito, mas ` +
		'`<Nome>Types.ts` e `<nome>Variants.ts` continuam com o conteúdo antigo. Revise os três juntos.'
	: '';

const output = {
	systemMessage: `shadcn normalizado: ${moved.map((file) => file.componentName).join(', ')}`,
	hookSpecificOutput: {
		hookEventName: 'PostToolUse',
		additionalContext:
			`O CLI do shadcn gerou componente novo. A parte mecânica já foi feita:\n${movedList}\n` +
			'(arquivo movido para `PascalCase/PascalCase.tsx` e formatado pelo Biome).\n\n' +
			'Falta a parte que depende de ler o código. Leia `.claude/rules/shadcn.md` e aplique ' +
			'nos arquivos acima antes de seguir: props em `I<Nome>Props` no `<Nome>Types.ts`, cva ' +
			'em `<nome>Variants.ts`, `export function <Nome>` com props desestruturadas. ' +
			'Feche com `pnpm typecheck && pnpm lint && pnpm test` — nunca com build ou dev server.' +
			reinstallWarning
	}
};

process.stdout.write(JSON.stringify(output));
