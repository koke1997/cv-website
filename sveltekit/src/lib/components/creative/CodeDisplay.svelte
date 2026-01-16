<script lang="ts">
	interface Props {
		code: string;
		language?: string;
	}

	let { code, language = 'typescript' }: Props = $props();

	type TokenType = 'keyword' | 'string' | 'number' | 'comment' | 'function' | 'type' | 'text';

	interface Token {
		type: TokenType;
		value: string;
	}

	function tokenizeLine(line: string): Token[] {
		const tokens: Token[] = [];
		let i = 0;

		while (i < line.length) {
			// Comments
			if (line.slice(i, i + 2) === '//') {
				tokens.push({ type: 'comment', value: line.slice(i) });
				break;
			}

			// Strings (single, double, backtick)
			if (line[i] === '"' || line[i] === "'" || line[i] === '`') {
				const quote = line[i];
				let j = i + 1;
				while (j < line.length && line[j] !== quote) {
					if (line[j] === '\\') j++; // Skip escaped char
					j++;
				}
				tokens.push({ type: 'string', value: line.slice(i, j + 1) });
				i = j + 1;
				continue;
			}

			// Numbers
			if (/\d/.test(line[i])) {
				let j = i;
				while (j < line.length && /[\d.]/.test(line[j])) j++;
				tokens.push({ type: 'number', value: line.slice(i, j) });
				i = j;
				continue;
			}

			// Words (keywords, types, functions, identifiers)
			if (/[a-zA-Z_]/.test(line[i])) {
				let j = i;
				while (j < line.length && /\w/.test(line[j])) j++;
				const word = line.slice(i, j);

				// Check if it's a keyword
				const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'import', 'export', 'from', 'as', 'new', 'class', 'async', 'await', 'of', 'in'];
				const types = ['THREE', 'Math', 'React', 'PI', 'width', 'height', 'time', 'centerX', 'centerY', 'maxRadius', 'segments', 'rings', 'threshold'];

				// Check if followed by ( for function
				const isFunction = line[j] === '(' || (line.slice(j).match(/^\s*\(/) !== null);

				if (keywords.includes(word)) {
					tokens.push({ type: 'keyword', value: word });
				} else if (types.includes(word)) {
					tokens.push({ type: 'type', value: word });
				} else if (isFunction) {
					tokens.push({ type: 'function', value: word });
				} else {
					tokens.push({ type: 'text', value: word });
				}
				i = j;
				continue;
			}

			// Everything else
			tokens.push({ type: 'text', value: line[i] });
			i++;
		}

		return tokens;
	}

	let lines = $derived(code.split('\n').map((line, idx) => ({
		number: idx + 1,
		tokens: tokenizeLine(line)
	})));
</script>

<div class="code-display">
	<div class="code-header">
		<div class="window-controls">
			<span class="dot red"></span>
			<span class="dot yellow"></span>
			<span class="dot green"></span>
		</div>
		<span class="language-badge">{language}</span>
	</div>
	<div class="code-content">
		<div class="line-numbers">
			{#each lines as line}
				<span class="line-number">{line.number}</span>
			{/each}
		</div>
		<pre class="code-block"><code>{#each lines as line, idx}{#each line.tokens as token}<span class="token-{token.type}">{token.value}</span>{/each}{#if idx < lines.length - 1}
{/if}{/each}</code></pre>
	</div>
</div>

<style>
	.code-display {
		background: #1e1e2e;
		border-radius: 12px;
		overflow: hidden;
		font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace;
		font-size: 0.8rem;
		line-height: 1.6;
	}

	.code-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1rem;
		background: #181825;
		border-bottom: 1px solid #313244;
	}

	.window-controls {
		display: flex;
		gap: 0.5rem;
	}

	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
	}

	.dot.red { background: #f38ba8; }
	.dot.yellow { background: #f9e2af; }
	.dot.green { background: #a6e3a1; }

	.language-badge {
		font-size: 0.7rem;
		color: #6c7086;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.code-content {
		display: flex;
		padding: 1rem 0;
		overflow-x: auto;
	}

	.line-numbers {
		display: flex;
		flex-direction: column;
		padding: 0 1rem;
		text-align: right;
		user-select: none;
		border-right: 1px solid #313244;
		color: #45475a;
	}

	.line-number { font-size: 0.75rem; }

	.code-block {
		margin: 0;
		padding: 0 1.5rem;
		color: #cdd6f4;
		white-space: pre;
	}

	/* Token colors - Catppuccin Mocha */
	.token-keyword { color: #cba6f7; }
	.token-string { color: #a6e3a1; }
	.token-number { color: #fab387; }
	.token-comment { color: #6c7086; font-style: italic; }
	.token-function { color: #89b4fa; }
	.token-type { color: #f9e2af; }
	.token-text { color: #cdd6f4; }
</style>
