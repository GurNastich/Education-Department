suite('Global Tests', function() {
  test('This page has acceptable header', function() {
    assert(document.title && document.title.match(/\S/) && document.title.toUpperCase() !== 'TODO');
  });
});