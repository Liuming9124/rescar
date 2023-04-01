const db = require("../route/modules/db");

const cartController = {

    cartPage: (req, res) => {
        res.render('cart',{
            'cusname': '',
            'session': req.session
        })
    },
    confirmCart:async (req, res) => {
        cart = req.session.cart
        // console.log(cart)
        
        async function buildcmd(){
            let cmd = '';
            //  處理購物車內的資料，將每筆資料組合成string
            for (let i = 0; i < cart.length; i++) {
                let item = JSON.parse(cart[i].token)    //  商品詳細資料
                cmd+=`{name: '${item.name}',price: '${item.price.low}', amt:'${cart[i].amt}', status:'0'}`
                if (i!=cart.length-1)
                    cmd+=','
            }
            return cmd
        }

        const cartsCmd= await buildcmd()
        
        const now = new Date();
        const cdate = now.toISOString().replace('Z', '+0000').replace(/T|:/g, '-').slice(0, -5) + 'Z';
        
        //  將所有購物車資料組合成完整的command
        let command = 
        `
        match (n:url{link:'${req.session.seed}'})
        create(o:order{time:'${cdate}', status:'0', table: '${req.session.table}'})
        create (n) -[:order]-> (o)
        with o
        UNWIND [
            ${cartsCmd}
        ] AS carts
        CREATE (c:cart) SET c = carts
        CREATE (o)-[:orders]->(c)
        RETURN o,c
        `
        // console.log('cmd:',command)

        //  command to db
        session = db.session()
        session
            .run(`${command}`)
            .catch(error => {
                console.log('order error: ',error)
            })
            .then(() => {
                //  點完餐後將購物車清空並將訂單數量加一
                req.session.orderamt += 1
                req.session.cart=''
                session.close();
                //  重新導向至訂單畫面
                res.redirect('/orderrecord')
            })
    }
}

module.exports = cartController