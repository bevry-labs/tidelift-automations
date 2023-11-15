// tidelift.com#%#(async function() { const f = await fetch('https://raw.githubusercontent.com/bevry-labs/tidelift-automations/main/source/automate-release-managers.js'); const t = await f.text(); eval(t) })()
function waitSeconds (seconds) {
	return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}
async function verifyReleaseManagers (index = 0) {
	document.title = 'waiting for packages'
	const $anyPackage = document.querySelector('div.small-padding.clickable-cursor[task_count]')
	while ( !$anyPackage ) {
		await waitSeconds(1) // still loading
	}

	// todo packages
	document.title = 'finding package'
	const $todoPackages = document.querySelectorAll('div.small-padding.clickable-cursor[task_count="1"]')
	if ( !$todoPackages.length ) {
		document.title = 'automation complete'
		alert(document.title)
		return
	}
	const $package = $todoPackages[index]
	if ( !$package ) {
		document.title = 'loading next page'
		const url = new URL(location.href)
		const nextPage = Number(url.searchParams.get('page') || 1) + 1
		const $nextPage = document.querySelector(`a.pagination-link[aria-label="Page ${nextPage}."]`)
		$nextPage.click()
		return
	}
	$package.click()
	
	document.title = 'finding maintainers'
	let managers = '', $managers, $checkbox, $submit, $background
	while ( !managers || !$managers || !$checkbox || !$submit ) {
		$background = document.querySelector('.modal-background')
		$submit = document.querySelector('.button.is-primary')
		$checkbox = document.querySelector('input[type=checkbox]')
		$managers = document.querySelectorAll('.has-text-weight-bold.my-2')
		managers = Array.from($managers || []).map(i => i.innerText).join(', ')
		await waitSeconds(1)
	}
	if ( managers !== 'bevryme' ) {
		document.title = 'unexpected maintainers: ' + managers
		$package.innerText += ': ' + managers
		$background.click()
		await waitSeconds(1)
		return verifyReleaseManagers(index + 1)
	}
	
	document.title = 'confirming maintainers'
	$checkbox.click()
	await waitSeconds(1)
	
	document.title = 'saving maintainers'
	$submit.click()
	await waitSeconds(1)
	
	document.title = 'continuing'
	return verifyReleaseManagers(index)
}
if ( location.pathname === '/lifter/release_managers_reviewed/packages/' ) {
	verifyReleaseManagers()
}
