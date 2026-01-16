<script lang="ts">
	const socialLinks = [
		{
			name: 'LinkedIn',
			url: 'https://www.linkedin.com/in/kokalovic/',
			icon: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z'
		},
		{
			name: 'GitHub',
			url: 'https://github.com/koke1997',
			icon: 'M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z'
		},
		{
			name: 'SoundCloud',
			url: 'https://soundcloud.com/kokeivanov',
			icon: 'M11.56 8.87V17h8.76c1.48 0 2.68-1.2 2.68-2.68c0-1.47-1.2-2.67-2.68-2.67c-.57 0-1.09.19-1.52.5c-.16-2.14-1.94-3.85-4.12-3.85c-1.29 0-2.44.59-3.12 1.57m-1.04 0c-.68-.98-1.83-1.57-3.12-1.57c-2.18 0-3.96 1.71-4.12 3.85c-.43-.31-.95-.5-1.52-.5C.28 10.65-.92 11.85-.92 13.32c0 1.48 1.2 2.68 2.68 2.68h5.08V8.87'
		},
		{
			name: 'Email',
			url: 'mailto:ivankokalovic@protonmail.ch',
			icon: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4l-8 5l-8-5V6l8 5l8-5v2Z'
		}
	];

	const currentYear = new Date().getFullYear();
</script>

<footer class="footer">
	<div class="footer-content">
		<div class="footer-brand">
			<span class="footer-name">Ivan Kokalovic</span>
			<span class="footer-title">Backend Developer & Infrastructure Engineer</span>
		</div>

		<div class="footer-social">
			{#each socialLinks as link}
				<a href={link.url} target="_blank" rel="noopener noreferrer" title={link.name} class="social-link">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
						<path fill="currentColor" d={link.icon}/>
					</svg>
				</a>
			{/each}
		</div>

		<div class="footer-copyright">
			<p>Copyright &copy; {currentYear} Ivan Kokalovic</p>
		</div>
	</div>
</footer>

<style>
	.footer {
		background: var(--cv-paper);
		border-top: 1px solid var(--cv-border);
		padding: var(--space-lg) 0;
		margin-top: auto;
	}

	.footer-content {
		max-width: var(--max-width);
		margin: 0 auto;
		padding: 0 var(--space-md);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-md);
		text-align: center;
	}

	.footer-brand {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.footer-name {
		font-family: var(--font-display);
		font-size: 1.25rem;
		color: var(--cv-charcoal);
	}

	.footer-title {
		font-size: 0.875rem;
		color: var(--cv-text-muted);
	}

	.footer-social {
		display: flex;
		gap: var(--space-xs);
	}

	.social-link {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--cv-cream);
		border: 1px solid var(--cv-border);
		border-radius: 8px;
		color: var(--cv-text-muted);
		transition: var(--transition-fast);
	}

	.social-link:hover {
		background: var(--cv-accent-glow);
		border-color: var(--cv-accent);
		color: var(--cv-accent);
	}

	.footer-copyright {
		font-size: 0.8125rem;
		color: var(--cv-text-muted);
	}

	.footer-copyright p {
		margin: 0;
	}
</style>
