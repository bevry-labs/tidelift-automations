// tidelift.com#%#(async function() { const f = await fetch('https://raw.githubusercontent.com/bevry-labs/tidelift-automations/main/source/automate.js'); const t = await f.text(); eval(t) })()
function waitSeconds (seconds) {
	return new Promise(resolve => setTimeout(resolve, seconds * 1000))
}
async function verifyReleaseManagers (index = 0) {
	document.title = 'waiting for packages'
	while ( !document.querySelector('div.small-padding.clickable-cursor[task_count]') ) {
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
		await waitSeconds(5)
		return verifyReleaseManagers(0)
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
async function verifyLicenses (index = 0) {
	document.title = 'waiting for packages'
	while ( !document.querySelector('div.small-padding.clickable-cursor[task_count]') ) {
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
		await waitSeconds(5)
		return verifyLicenses(0)
	}
	$package.click()
	
	document.title = 'finding licenses'
	let $license, $submit, $background
	while ( !$license || !$submit || !$background ) {
		$background = document.querySelector('.modal-background')
		$submit = document.querySelector('.button.is-primary')
		$license = document.querySelector('input.check')
		await waitSeconds(1)
	}

	const $expectedLicense = document.querySelector('input.check[name="Artistic License 2.0"]')
	if ( !$expectedLicense ) {
		document.title = 'unexpected license: ' + $license.getAttribute('name')
		$package.innerText += ' ' + document.title
		$background.click()
		await waitSeconds(1)
		return verifyLicenses(index + 1)
	}
	
	document.title = 'confirming license'
	$expectedLicense.click()
	await waitSeconds(1)
	
	document.title = 'saving license'
	$submit.click()
	await waitSeconds(1)
	
	document.title = 'continuing'
	return verifyLicenses(index)
}
if ( location.pathname === '/lifter/release_managers_reviewed/packages/' ) {
	verifyReleaseManagers()
} else if ( location.pathname === '/lifter/packages_have_verified_licenses/packages/' ) {
	verifyLicenses()
}
