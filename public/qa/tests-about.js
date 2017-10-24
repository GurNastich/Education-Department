suite('About page tests', function() {
  test('Page contains link to the Contacts page', function() {
    assert($('a[href="/contact"]').length);
  });
});