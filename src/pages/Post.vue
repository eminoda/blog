<template>
	<content-layout>
		<div class="markdown-body" v-html="htmlData"></div>
	</content-layout>
</template>

<script>
import Http from '../utils/Http.js';
import ContentLayout from '../components/layout/ContentLayout';
export default {
	components: { ContentLayout },
	data() {
		return {
			htmlData: '',
		};
	},
	mounted() {
		const self = this;
		new Http()
			.request({
				url: `/posts/${this.$route.params.id}`,
			})
			.then((data) => {
				self.htmlData = data;
			})
			.catch((err) => {});
	},
};
</script>

<style lang="scss" scoped></style>
