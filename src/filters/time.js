import moment from 'moment';

import Vue from 'vue';
Vue.filter('dateTimeFilter', function(value) {
	if (value) {
		return moment(value).format('YYYY-MM-DD HH:mm:ss');
	}
	return '';
});
