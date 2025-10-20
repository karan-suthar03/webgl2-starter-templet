export async function loadShader(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load shader: ${response.statusText}`);
        }
        return await response.text();
    } catch (error) {
        throw new Error(`Error loading shader from ${url}: ${error.message}`);
    }
}

export async function loadShaders(shaderPaths) {
    const shaderPromises = Object.entries(shaderPaths).map(async ([name, path]) => {
        const source = await loadShader(path);
        return [name, source];
    });

    const shaderEntries = await Promise.all(shaderPromises);
    return Object.fromEntries(shaderEntries);
}