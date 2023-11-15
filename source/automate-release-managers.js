function waitSeconds (seconds) {
	return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}
async function verifyReleaseManagers () {
	document.title = 'waiting for packages'
	while ( ! document.querySelector('div.small-padding.clickable-cursor') ) {
		await waitSeconds(1) // still loading
	}
	
	document.title = 'finding package'
	const package = document.querySelector('div.small-padding.clickable-cursor[task_count="1"]')
	if ( !package ) {
		document.title = 'automation complete'
		alert(document.title)
		return
	}
	package.click()
	
	document.title = 'finding maintainers'
	let managers = ''
	while ( !managers ) {
		managers = Array.from(document.querySelectorAll('.has-text-weight-bold.my-2') || []).map(i => i.innerText).join(', ')
		await waitSeconds(1)
	}
	if ( managers !== 'bevryme' ) {
		document.title = 'Release managers are not bevryme: ' + managers
		alert(document.title)
		return
	}
	
	document.title = 'confirming maintainers'
	document.querySelector('input[type=checkbox]').click()
	await waitSeconds(1)
	
	document.title = 'saving maintainers'
	document.querySelector('.button.is-primary').click()
	await waitSeconds(1)
	
	document.title = 'continuing'
	return verifyReleaseManagers()
}
verifyReleaseManagers()
