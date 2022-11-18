# Return Friendly Name From ENUM
This trick will return the friendly name from the enum

```ts
enum AccountStatus {
    "Inactive" = 0,
    "Active" = 1,
    "Work-In-Progress" = 3
};

const data = {
    jobId: 123,
    name: "SomeJobTitle",
    status: 3
};

const accountStatus: string = AccountStatus[data.status as AccountStatus];

console.log(accountStatus);
```