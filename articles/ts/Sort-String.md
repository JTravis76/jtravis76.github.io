# Sorting String in Typescript

```ts
    const requests = [
      {
        id: 0,
        jobNumber: "11223344",
        agentName: "",
        jobName: "Job 001",
        status: "New",
        priority: "low",
        agentAssignedDate: "1/30/2022"
      },
      {
        id: 280,
        jobNumber: "55667788",
        agentName: "Agent Carter",
        jobName: "Job 001",
        status: "In-Progress",
        priority: "low",
        agentAssignedDate: "10/12/2022"
      },
      {
        id: 0,
        jobNumber: "99551122",
        agentName: "",
        jobName: "Job 001",
        status: "New",
        priority: "low",
        agentAssignedDate: "1/30/2022"
      },
      {
        id: 2457,
        jobNumber: "88551122",
        agentName: "Agent Carter",
        jobName: "Job 001",
        status: "In-Progress",
        priority: "low",
        agentAssignedDate: "1/5/2023"
      },
      {
        id: 566,
        jobNumber: "22331122",
        agentName: "Agent Carter",
        jobName: "Job 001",
        status: "In-Progress",
        priority: "high",
        agentAssignedDate: "12/1/2022"
      },
    ].sort((a, b) => {
      return a.jobNumber > b.jobNumber ? 1 : -1;
    });
```