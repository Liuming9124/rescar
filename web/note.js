if (req.session.userName){
    var show =[]
    session = db.session()
    session
    .run('match (n:shelf) return n.name as name ')

    .then(result => {
        result.records.forEach(record => {
            show.push(record.get('name'))
            // console.log(record.get('name'))
            // console.log(JSON.stringify(record.get('name')))
        });
        // res.send(result); 
        console.log(show)
        
    })      

    // .then(result => {
    //     // console.log(result.records)

    //     // const singleRecord = result.records[0]
    //     // const node = singleRecord.get(0)
    //     // console.log(node)

    //     result.records.forEach(record => {
    //         console.log(record.get('name'))
    //     })
        
    //     // show = node.properties.account
    //     // console.log(node.properties.account)
        
    // })

    .catch(error => {
        console.log(error)
    })
    .then(() => session.close())
    // .then(() => res.redirect('/home'))
    // res.redirect('/home')
    .then(() => {
        res.render('shelf',{
            'cusname': '',
            'carid'  : '',
            'phone'  : '',
            'shelf': show,
            'counter':''
        })
    })
}
else{
    res.redirect('/login')
}


console.log('----------------------------------------------------------------------------------------------')

// add shelf and its counter
`
merge (a:shelf{name:'A'})
with a
unwind [
    {name:'a1'},
    {name:'a2'},
    {name:'a3'}
] as p
create (m:counter) set m = p
create (a)-[:has]->(m)
return a,m
`


// create item

`
match (n:shelf{name:'A'}) -[:has]-> (p:counter{name:'a1'})
create (p)-[:own]->(x:item{name:'機油1'})
return x
`

// find item in counter a1 of shelf A
`
match (n:shelf{name:'A'})-[has]->(x:counter{name:'a1'})-[own]->(y)
return y
`



        // // 先找出是否為合法URL，若合法才給予進入
        // if (req.session.seed) {  //  get session seed
        //     valid = true
        // }
        // else if (req.params.url != '') {    // get incoming url and set Seed in session
        //     // find whether url exist in db
        //     session = db.session()
            // session.run(`match(result:url{link:'${req.params.url}'}) return (result)`)
            //     .then(result => {
            //         // console.log(result.records)
            //         const singleRecord = result.records[0]
            //         const node = singleRecord.get(0)
            //         // console.log(node)
            //         console.log(node.properties.link)
            //     })
            //     .catch(error => {
            //         console.log('home urLink not found error:')
            //         console.log(error)
            //     })
            //     .finally(() => {
            //         valid = true
            //         req.session.seed = req.params.url
            //         session.close();
            //     });
        // }
        // else {
        //     res.status(404).send('Page not found');
        // }