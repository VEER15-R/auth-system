export const fetchWithAuth = async (url, options = {}) => {
    let res = await fetch(url, {
        ...options,
        credentials: "include",
    });

    if (res.status === 401) {

        const refreshRes = await fetch("/api/auth/refresh", {
            method: "GET",
            credentials: "include",
        });

        if (!refreshRes.ok) {
            window.location.href = "/login";
            return;
        }

        res = await fetch(url, {
            ...options,
            credentials: "include",
        });
    }

    return res;
};