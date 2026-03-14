export async function fetcher<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    const res = await fetch(input, { ...init, cache: 'no-store' });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || 'Unknown error');
    }
    return res.json();
}
