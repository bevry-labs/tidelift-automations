// tidelift.com#%#(async function() { const f = await fetch('https://raw.githubusercontent.com/bevry-labs/tidelift-automations/main/source/automate.js'); const t = await f.text(); eval(t) })()
(async function () {
	let packageIndex = 0
	function waitSeconds (seconds) {
		return new Promise(resolve => setTimeout(resolve, seconds * 1000))
	}
	async function openPackage() {
		document.title = 'waiting for packages'
		await waitSeconds(5)
		while ( !document.querySelector('div.small-padding.clickable-cursor[task_count]') ) {
			await waitSeconds(5) // still loading
		}
		document.title = 'finding package'
		
		const $todoPackages = document.querySelectorAll('div.small-padding.clickable-cursor[task_count="1"]')
		if ( !$todoPackages.length ) {
			resetPackageIndex()
			document.title = 'no more packages left'
			alert(document.title)
			return
		}
		
		const $package = $todoPackages[packageIndex]
		if ( !$package ) {
			resetPackageIndex()
			document.title = 'loading next page'
			const url = new URL(location.href)
			const nextPage = Number(url.searchParams.get('page') || 1) + 1
			const $nextPage = document.querySelector(`a.pagination-link[aria-label="Page ${nextPage}."]`)
			$nextPage.click()
			return await openPackage()
		}
		
		$package.click()
		await waitSeconds(5) // give it time to load, otherwise the prior package dom elements may be persisting
		return $package
	}
	function resetPackageIndex() {
		packageIndex = 0
	}
	function nextPackageIndex() {
		++packageIndex
	}
	async function verifyReleaseManagers () {
		resetPackageIndex()
		while (true) {
			const $package = await openPackage()
			if ( !$package ) break
			
			document.title = 'finding maintainers'
			let managers = '', $managers, $checkbox, $submit, $background
			while ( !managers || !$managers || !$checkbox || !$submit ) {
				$background = document.querySelector('.modal-background')
				$submit = document.querySelector('.button.is-primary')
				$checkbox = document.querySelector('input[type=checkbox]')
				$managers = document.querySelectorAll('.has-text-weight-bold.my-2')
				managers = Array.from($managers || []).map(i => i.innerText).join(', ')
				await waitSeconds(2)
			}
			if ( managers !== 'bevryme' ) {
				document.title = 'unexpected maintainers: ' + managers
				$package.innerText += ': ' + managers
				$background.click()
				nextPackageIndex()
				continue
			}
			
			document.title = 'confirming maintainers'
			$checkbox.click()
			
			document.title = 'saving maintainers'
			await waitSeconds(1)
			$submit.click()
		}
	}
	async function verifyLicenses () {
		resetPackageIndex()
		while (true) {
			const $package = await openPackage()
			if ( !$package ) break
			
			document.title = 'finding licenses'
			let $submit, $background
			while ( !$submit || !$background ) {
				$background = document.querySelector('.modal-background')
				$submit = document.querySelector('.button.is-primary')
				await waitSeconds(2)
			}
		
			const $expectedLicense = document.querySelector('input.check[name="Artistic License 2.0"]')
			if ( !$expectedLicense ) {
				document.title = 'unexpected license'
				$package.innerText += ' ' + document.title
				$background.click()
				nextPackageIndex()
				continue
			}
			
			document.title = 'confirming license'
			$expectedLicense.click()
			
			document.title = 'saving license'
			await waitSeconds(1)
			$submit.click()
		}
	}
	async function verifyVersioningSchemes () {
		resetPackageIndex()
		while (true) {
			const $package = await openPackage()
			if ( !$package ) break
			
			document.title = 'finding versioning schemes'
			let $semver, $submit, $background
			while ( !$semver || !$submit || !$background ) {
				$background = document.querySelector('.modal-background')
				$submit = document.querySelector('.button.is-primary')
				$semver = document.querySelector('input.check[value="semver"]')
				await waitSeconds(2)
			}
		
			document.title = 'confirming versioning scheme'
			$semver.click()
			
			document.title = 'saving versioning scheme'
			await waitSeconds(1)
			$submit.click()
		}
	}
	async function verifyMaintenancePlan () {
		resetPackageIndex()
		while (true) {
			const $package = await openPackage()
			if ( !$package ) break
			
			document.title = 'finding maintenance plan'
			let $recent, $no, $submit, $background
			while ( !$recent || !$no || !$submit || !$background ) {
				$background = document.querySelector('.modal-background')
				$submit = document.querySelector('.button.is-primary')
				$recent = document.querySelector('input.check[value="recent"]')
				$no = document.querySelector('input.check[value="no"]')
				await waitSeconds(2)
			}
		
			document.title = 'confirming maintenance plan'
			$recent.click()
			$no.click()
			
			document.title = 'saving maintenance plan'
			await waitSeconds(1)
			$submit.click()
		}
	}
	const actionMap = {
		'/lifter/release_managers_reviewed/packages/': verifyReleaseManagers,
		'/lifter/packages_have_verified_licenses/packages/': verifyLicenses,
		'/lifter/packages_have_versioning_schemes/packages/': verifyVersioningSchemes,
		'/lifter/packages_have_maintenance_plans/packages/': verifyMaintenancePlan
	}
	const action = actionMap[location.pathname]
	if ( action ) await action()
})()
