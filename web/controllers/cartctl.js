const db = require("../route/modules/db");
var session = db.session()

const cartController = {

    cartPage: (req, res) => {
        res.render('cart',{
            'cusname': '',
            'session': req.session
        })
    },
    confirmCart:async (req, res) => {
        // console.log(req.body)
        cart = req.session.cart
        console.log(cart)

        
        async function buildcmd(){
            let cmd = '';
            //  處理購物車內的資料，將每筆資料組合成string
            for (let i = 0; i < cart.length; i++) {
                let item = JSON.parse(cart[i].token)    //  商品詳細資料
                console.log('item:',item)
                console.log('name', cart[i].token.name)
                cmd+=`{name: '${item.name}',price: '${item.price.low}', amt:'${cart[i].amt}'}`
                if (i!=cart.length-1)
                    cmd+=','
            }
            return cmd
        }

        const cartsCmd= await buildcmd()
        
        //  將所有購物車資料組合成完整的command
        let command = 
        `
        match (n:url{link:'${req.session.seed}'})
        create(o:order{time:'${new Date()}'})
        create (n) -[:order]-> (o)
        with o
        UNWIND [
            ${cartsCmd}
        ] AS carts
        CREATE (c:cart) SET c = carts
        CREATE (o)-[:orders]->(c)
        RETURN o,c
        `
        
        console.log('cmd:',command)

        res.redirect('/cart')
    }
}

module.exports = cartController