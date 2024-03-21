class DigitalMarketingManagerCache{
    constructor(){
        this.apiCache;
    }
    async initCache(cacheName){
        this.apiCache = await caches.open(cacheName);
        console.log("cache initialized ", this.apiCache);
    }
    async addUrl(url){
        let matchContent = await this.apiCache.match(url);
        if(matchContent == null){
            //add url in the cache if not ( /!\ need online to work /!\ )
            //await this.apiCache.add(url);
            await this.apiCache.add(url);
            console.log("url cached");
        }
        //else if the url is already cached
        else{
            console.log("url is inside the cache since the last time");
        }
    }
    async deleteUrl(url){
        await this.apiCache.delete(url);
        console.log("url deleted");
    }
    async addAndLoadUrlFromCache(mediaTag, url){
        let matchContent = await this.apiCache.match(url);
        if(matchContent == null){
            //add url in the cache if not ( /!\ need online to work /!\ )
            await this.apiCache.add(url);
            console.log("url has not been cached, now it is");
            matchContent = await this.apiCache.match(url);
        }
        //else if the url is already cached
        else{
            console.log("url is inside the cache since the last time");
        }
        //loading url
        let matchContentWithBlob = await matchContent.blob();
        if(matchContentWithBlob != null){
            var mediaSource = URL.createObjectURL(matchContentWithBlob);
            if(mediaSource != null)
            {
                mediaTag.src = mediaSource;
                console.log("url loaded ", mediaSource);
            }
            else{
                console.log("url cannot be loaded");
                //load a video that show error
            }
        }
        else{
            console.log("url cannot be loaded");
            //load a video that show error
        }
    }
    async purgeCache(url, n){
        let matchContent = await this.apiCache.match(url);
        let today = new Date();
        console.log("receive today",today);
        let timePurge = 3600000*n; //n days before purging the cache (the company will chosen)
        console.log("receive timePurge", timePurge);
        console.log("match url",matchContent);
        console.log("receive timed cached",matchContent.headers.get('Date'));
        if(today < matchContent.headers.get('Date')+timePurge){
            //this.apiCache.delete(url);
            console.log("url expired");
        }
        else{
            console.log("url not expired");
        }
    }
}
