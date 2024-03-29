const puppeteer =  require('puppeteer')

const launching =async ()=>{

    const browser =await puppeteer.launch({headless:false,
    defaultViewport :false,
    userDataDir: "./tmp"
    })
    const page = await browser.newPage();

    await page.goto("https://www.amazon.in/s?i=apparel&srs=66530045031&bbn=66530045031&dc&qid=1711696812&ref=lp_specialty-aps_nr_i_10",{waitUntil: "domcontentloaded"});
    
     
    const products = await page.$$("div.s-main-slot.s-result-list.s-search-results.sg-row > .s-result-item");


    let list_of_products =[]
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
    console.log(list_of_products)


    
   


    await browser.close();
}

launching()