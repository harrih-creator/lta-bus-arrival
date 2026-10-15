# User Prompts History

This document collates all prompts issued during the development of the Singapore LTA Bus Arrival & Real-Time Tracking application.

---

### Prompt 1: Initial Application Build (Frontend)

```text
build a Singapore based bus arrival time application that tracks real time bus locations and provides accurate wait time predictions for all LTA bus stops.

build the front end for now, I will include the backend connection later.
```

---

### Prompt 2: GitHub Repository Setup & Push

```text
gitpush https://<TOKEN>@github.com/harrih-creator/lta-bus-arrival.git
```

---

### Prompt 3: Serverless LTA DataMall Integration

```text
add serverless connection that pulls live data from LTA Datamall using the following endpoints:

- store this in /api folder (project root level) not the src folder
- include /health.ts and busarrival.ts within that subfolder
- do not hardcode any key, I will include them later

GET https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=83139
# AccountKey: <LTA_ACCOUNT_KEY>
# accept: application/json
```

---

### Prompt 4: Prompt Collation

```text
collate all the prompts written thus far and store them into the following file: prompts.md
```
