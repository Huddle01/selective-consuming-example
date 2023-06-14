## Selective consuming and producing 
This repository contains an example of using Huddle01 for selectively produce and consume which you can use it for your metaverse. Selectively produce means you can select to which peers you want to produce your stream and selectively consume means you can select from which peers you want to consume streams. 

### Installation
1. Clone the repository using `git clone https://github.com/Huddle01/selective-consuming-example`
2. Change the directory using `cd selective-consuming-example`
3. Run `pnpm i`, `yarn install` or `npm install` to install all packages. 
4. Once, all packages are install start the server using `pnpm dev`, `yarn dev` or `npm run dev`. 

### Using example app
1. Generate `projectId` from [docs](https://huddle01.com/docs/api-keys) by connecting your wallet. Also, copy the `API_KEY` to generate `roomId`. 
2. Use any API testing platform such as Postman, Thunderclient or even you can use cURL to generate roomId. To generate `roomId` refer [here](https://huddle01.com/docs/apis/types/create-room)
3. Once, you generate `projectId` and have `roomId` you can use that to join lobby. 
4. After joining lobby, allow permissions for cam/mic and click on join room. 
5. Repeat these same steps by opening same URL in other two tabs (for testing purpose). Make sure that you join using same `roomId`. 
6. Now, go to first tab click on checkbox for audio/video of any peer and click on mic/cam icon to start producing. 
7. If you go to that peer (by opening respective tab) you can see that peer will starts consuming the audio/video. This happened because we have selectively produce for that peer. 

### Demo

https://github.com/Huddle01/selective-consuming-example/assets/43074241/f6ea498f-6f36-4604-9d4b-8ba6dfc0c0a8


**To know more about selective consuming and producing you can refer to detailed docs from [here](https://huddle01.com/docs/sdk/usecase/metaverse).**
