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
