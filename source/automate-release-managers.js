function wait (ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}
async function verifyReleaseManagers () {
	document.title = 'automating'
	if ( ! document.querySelector('div.small-padding.clickable-cursor') ) {
		await wait(1000) // still loading
		return verifyReleaseManagers()
	}
	const package = document.querySelector('div.small-padding.clickable-cursor[task_count="1"]')
	if ( !package ) return alert('all done')
	package.click()
	let managers = ''
	while ( !managers ) {
		managers = Array.from(document.querySelectorAll('.has-text-weight-bold.my-2') || []).map(i => i.innerText).join(', ')
		await wait(1000)
	}
	if ( managers !== 'bevryme' ) return alert('Release managers are not bevryme: ' + managers)
	await wait(1000)
	document.querySelector('input[type=checkbox]').click()
	await wait(1000)
	document.querySelector('.button.is-primary').click()
	await wait(1000)
	return verifyReleaseManagers()
}
verifyReleaseManagers()
