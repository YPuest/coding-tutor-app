export function load({ url }) {
	let redirectTo = url.searchParams.get('redirect') || null;

	return { redirectTo };
}