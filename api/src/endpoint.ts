function main(): void {
    let params = new URLSearchParams(location.search);
    const type: string = params.get('type') as string;
    if (type == 'cli') {
        const lessonId: string = params.get('lesson') as string;
        const course: string = params.get('course') as string;
        const prefix: string = params.get('prefix') || 'lesson';
        const success: boolean = params.get('success') === "true";
        let key = `${course}_${prefix + lessonId + '.json'}_${success}`;
        localStorage.setItem('cli_success', key);
    }
    window.location.href = "about:blank";
}
main();