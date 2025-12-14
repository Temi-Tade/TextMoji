export function updateStorage(data: any) {
    localStorage.setItem("gitUserCards", JSON.stringify(data));
}

export function readStorage() {
    return JSON.parse(localStorage.getItem("gitUserCards") as any);
}