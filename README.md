# SPF Web Service

A simple node web service that checks a domain to see if an SPF record is present and then returns a new/modified SPF record that includes the specified services record.

Demo at: https://tranquil-stream-29919.herokuapp.com

## Endpoints


### Update SPF Record - `/update-spf` - (POST)

#### Request Data
The request data should be passed as a JSON object.

* `domain` - The domain that should be checked.
* `service_spf` - A URL for the SPF entry that should be added.

#### Response Data

A successful response will return a JSON object containing the updated SPF record and what operations was performed.
```
{
	"domain": "getoswald.com",
	"operation": "not-modified",
	"record": "v=spf1 a mx include:spf.mtasv.net include:helpscoutemail.com ~all"
}
```

An unsuccessful response will return a JSON object with errors.
```
{
  errors: [ 'Whoops! An error occured. Make sure you specified a valid domain name.' ]
}
```

## License

Copyright (c) 2016 [Matt West](https://mattwest.io)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
