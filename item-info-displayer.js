/**
 * Determins whether use fabrication/item despawn control.
 * Only being effective while related mod is loaded (and the option is enabled).
 * Accepted values: true / false
 * Default: false
 */
const fabrication_mode = false

/**
 * Determins whether show the rest life of the entity before it's despawn.
 * Accepted values: true / false
 * Default: true
 */
const show_rest_life  = true

/**
 * Determins whether change the displaying color of item's name according to it's rarity.
 * If disabled, all of colors will be set to white.
 * Accepted values: true / false
 * Default: true
 */
const show_rarity = true

/**
 * Determins whether show the name customized by players.
 * Accepted values: true / false
 * Default: false
 */
const enable_custom_name = false


/**
 * Authorship(s): QQ酱530873
 * Links: 
 * https://www.mcmod.cn/author/31061.html
 * https://github.com/acaeaeeda
 * 
 * Tips:
 * Use `reload` or `kubejs reload server_scripts` to reload your changes.
 */

ServerEvents.tick(event => {
	event.server.entities.filterSelector("@e[type=item]").forEach(entity => {
			// 获取掉落物距离自然消失所剩余的时间（单位:秒,向上取整）
            var restlife
            if (fabrication_mode == false){
                restlife = `${Math.trunc((6000-entity.age)/(20))}`
            }else{
                // 对于 fabrication/item despawn control 的兼容
                var ExtraTime = entity.nbt["fabrication:ExtraTime"]
                if (ExtraTime == null){
                    restlife = `${Math.trunc((6000-entity.age)/(20))}`
                }else{
                    restlife =  `${Math.trunc((entity.nbt["fabrication:ExtraTime"] + 6000)/(20))}`
                }
                
            }
	    	// 获取掉落物所包含的物品
            let id = (entity.nbt["Item"]["id"])
            // 获取掉落物所包含的物品的数量
            let amont = entity.nbt["Item"]["Count"]
            
            // 获取物品对象
            var item = Item.of(id)
            // 获取掉落物所包含的物品的本地化的名称
            let localname = ` ${item.getDisplayName().getString()} `
	    	// 处理部分特殊物品（硬编码）
            if (item.id == "minecraft:potion"){
                localname = " [药水] "
            }
            if (item.id == "minecraft:splash_potion"){
                localname = " [喷溅型药水] "
            }
            if (item.id == "minecraft:lingering_potion"){
                localname = " [滞留型药水] "
            }
            if (item.id == 'immersiveengineering:potion_bucket'){
                localname = " [桶装药水] "
            }
            if (item.id == "minecraft:tipped_arrow"){
                localname = " [药水箭] "
            }
            // 获取物品的稀有度
            let rarity = item.rarity
            // 设置物品部分字体颜色
            var name_part
            if (enable_custom_name){
                name_part = entity.item.displayName
            }else{
                name_part = Component.white(localname)
            }
            switch (rarity) {
                case "common":{
                    name_part = name_part;
                    break;
                }
                case "uncommon":{
                    name_part = name_part.yellow();
                    break;
                }
                case "rare":{
                    name_part = name_part.blue();
                    break;
                }
                case "epic":{
                    name_part = name_part.lightPurple();
                    break;
                }
                default :{
                    name_part = name_part;
                    break;
                }
            }
            if (show_rarity == false){
                name_part = Component.white(localname);
            }

	        // 设置时间部分字体颜色
	        var time_part
	        if (restlife >= 150){
	                time_part = Component.green(restlife);
	            }else{
	                if (restlife > 50){
	                    time_part = Component.gold(restlife);
	                }else{
	                    if (restlife >= 15){
	                        time_part = Component.red(restlife);
	                    }else{
	                        time_part = Component.darkRed(restlife);
	                    }
	                }
	            }
                
            // 拼接文本
            var text
            if (show_amount){
                text = Component.white(`${amont}x`).append(name_part)
            }else{
                text = name_part
            }
            
            if (show_rest_life){
                text.append(time_part)
            }
	        // 显示
	        entity.customNameVisible = true
	        entity.customName = text
            
        }
    )
})
