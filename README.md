# Macmillan Site to PDF

Built on [PhantomJS](http://phantomjs.org), this utility takes a URL with some optional parameters and converts that page to PDF. It includes customizations for Macmillan's use.

## Usage

```macpdf url=http://google.com "footer=Page %%pageNum%% out of %%pageTotal%%"```

Arguments with no spaces can be passed as normal. Arguments containing spaces must be surrounded with ```" "```.

Footer will dynamically add the current and total page numbers in place of ```%%pageNum%%``` and ```%%pageTotal%%``` respectively.
