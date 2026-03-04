function main() {
    var params = new URLSearchParams(location.search);
    var type = params.get('type');
    if (type == 'cli') {
        var lessonId = params.get('lesson');
        var course = params.get('course');
        var prefix = params.get('prefix') || 'lesson';
        var success = params.get('success') === "true";
        var key = "".concat(course, "_").concat(prefix + lessonId + '.json', "_").concat(success);
        localStorage.setItem('cli_success', key);
    }
}
main();
