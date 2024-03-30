const puppeteer =  require('puppeteer')

const getAllPageProducts =async ()=>{

    const browser =await puppeteer.launch({headless:false,
    defaultViewport :false,
    userDataDir: "./tmp"
    })
    const page = await browser.newPage();

    await page.goto("https://www.amazon.in/s?i=watches&bbn=2563505031&rh=n%3A2563505031%2Cp_n_feature_fourteen_browse-bin%3A11142592031%2Cp_123%3A230208%2Cp_36%3A3439820031&dc&qid=1711771504&rnid=3439816031&ref=sr_pg_1",{waitUntil: "domcontentloaded"});

    let list_of_products =[]
    let nextbtn_enabled = false

    while(true){

        nextbtn_enabled = await page.$('span.s-pagination-item.s-pagination-next.s-pagination-disabled') != null;
        const products = await page.$$("div.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item");
        
        for (const k of products) {
            let price = null;
            let name = null;
            let img = null;
    
            try{
                 name  =await page.evaluate(el => el.querySelector("h2 > a > span").textContent,k) 
            }
            catch(err){}
            try{
                 price  =await page.evaluate(el => el.querySelector("span.a-price-whole").textContent,k) 
            }
            catch(err){}
            try{
                 img  =await page.evaluate(el => el.querySelector(".s-image").getAttribute("src"),k)
            }
            catch(err){}
    
            if(name!=null){
                let obj = {
                    "name" : name,
                    "price" : price,
                    "image" : img,
                }
                list_of_products.push(obj)
            }        
        }
        console.log(list_of_products.length)
        
        if(!nextbtn_enabled){
            await Promise.all([
             page.click("a.s-pagination-item.s-pagination-next.s-pagination-button.s-pagination-button-accessibility.s-pagination-separator"),
             page.waitForNavigation({waitUntil: "networkidle2"})
            ])
       }
        else break;
    }
   
    console.log(list_of_products)
    console.log(list_of_products.length)

    await browser.close();
}

getAllPageProducts()