module.exports = {
    name: 'Open',
    description: 'Pack opener',
    execute(message, args) {
        //let timerStart = performance.now();
        //Some packs cant be opened
        if (args.includes('fortune') && (args.includes('key') || args.includes('keys'))) {
            return message.channel.send("I'm sorry I can't open Fortune Keys :(");
        } else if (args.includes('magnificence') && (args.includes('coupon') || args.includes('ticket'))) {
            return message.channel.send("I'm sorry I can't use the Palette of Fortune :(")
        }
  
        // Check amount and packname
        const msg = args.join(" ");
        const isNumber = /\d+/;
        //const packAmount = args[0].match(isNumber);
        
        function getPackObject(packName) {
            let packAlias = packName.toString().replace(/,/g,'').replace(/\s+/g, '').toLowerCase();
            try {
                let packObject = new require(`../droptables/${packAlias}.js`);
                return packObject;
            } catch (error) {
                message.channel.send(`I couldn't find the file *${packAlias}.js*`);
                return;
            }
        }

        const Amount = args.shift().match(isNumber);        
        const Pack = getPackObject(args);

        //const packName = msg.replace(packAmount,'');
    
        //Stop if pack amount is too high
        if (Amount > 10000) {
            return message.channel.send('Thats too many! Meoooow.');
        }

        //const Pack = new require(`../droptables/${packAlias}.js`);
        //console.log(Pack.dropTable);
    
        //insert code around here to find pack ID and quest ID 
        let packId;
        Pack.imageId ? packId = Pack.imageId : packId = 23830;

        //const questId = 40251;
    
        let inventory = [];

        function updateInventoryWith(packObject, packAmount) {
            let packLoot = [];
            let extraPacks = [];
            let tempInventory = [];
            let total = 0;

            let range = packObject.dropTable.reduce((arr, {dropChance}, i) => {
                arr[i] = (total += dropChance);
                return arr;
            }, [])

            for (let i = 0; i < packAmount; i++) {
                let randomDrop = Math.random() * total;
                let index = range.findIndex(v => v >= randomDrop);
                let loot = packObject.dropTable[index];

                packLoot.push(loot.name);
                if (loot.hasDroptable) {
                    extraPacks.push(loot.name);
                }
            }

            inventory.push({name:packObject.name, amount: parseInt(packAmount), loot: packLoot});

            if (extraPacks.length > 0) {
                for (const [packName, packAmount] of Object.entries(sortItems(extraPacks))) {
                    let newPack = getPackObject(packName);
                    tempInventory = updateInventoryWith(newPack, packAmount);
                    //inventory.push({name:packName, amount:packAmount, loot: tempInventory.loot});
                }
            }

            return inventory;

        }

        function sortItems(inventory) {
            let countedItem = {};
            inventory.forEach(function(i) {
                countedItem[i] = (countedItem[i] || 0)+1; 
            });
            return countedItem;
        }

        updateInventoryWith(Pack, Amount);
        
        
        // Create the Embed content
        const inventoryAndLoot = [];
        inventory.forEach(function(pack){
            let lootString = '';
            for (const [itemName, itemAmount] of Object.entries(sortItems(pack.loot))) {
                lootString += itemAmount +'x '+itemName+"\n";
            }
            inventoryAndLoot.push({name:pack.name + ' ('+ pack.amount +')', value: lootString})
        });
        
        const packLoot = {
            color: 0xFFD700,
            author: {
            name: 'Opening packs...',
            icon_url: 'http://www.pwdatabase.com/images/icons/generalm/'+packId+'.png',
            },
            fields: inventoryAndLoot,
            //timestamp: 'I took me '+timerStop-timerStart*100+' time to open '+packAmount+' packs - '+new Date(),
            timestamp: new Date(),
        };
        return message.channel.send({ embed: packLoot });

    },
};