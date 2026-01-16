<script lang="ts">
	import PersonalInfoForm from './forms/PersonalInfoForm.svelte';
	import SummaryForm from './forms/SummaryForm.svelte';
	import ExperienceForm from './forms/ExperienceForm.svelte';
	import EducationForm from './forms/EducationForm.svelte';
	import SkillsForm from './forms/SkillsForm.svelte';
	import CertificationsForm from './forms/CertificationsForm.svelte';
	import LanguagesForm from './forms/LanguagesForm.svelte';
	import ProjectsForm from './forms/ProjectsForm.svelte';
</script>

<div class="form-editor">
	<PersonalInfoForm />
	<SummaryForm />
	<ExperienceForm />
	<EducationForm />
	<SkillsForm />
	<CertificationsForm />
	<LanguagesForm />
	<ProjectsForm />
</div>

<style>
	.form-editor {
		display: flex;
		flex-direction: column;
		gap: 0;
	}
</style>
