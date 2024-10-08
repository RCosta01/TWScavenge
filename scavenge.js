javascript:
//Creators: Sophie "Shinko to Kuma" - Mitchell "Superdog"
//Upgraded by: FoX05
/*Update list:
V1.0 - Updated 2/03 - Added automatic grabbing of iables!
V1.1 - Updated 7/03 - Functionality on all servers!
V1.2 - Updated 8/03 - rewrote script to fix some big bugs, condensed code, retiring old version
V1.3 - Updated 9/03 - Adjusted script to work on mobile APP!
V1.4 - Updated 10/07/2024 - Upgraded algorythm for scavanges, fixed enable buttons
*/

//added to count how many times script gets ran

var count = 0;


function scavenge() {
    //checking correct page
    const doc = document;
    if (window.frames.length > 0 && window.main != null) doc = window.main.document;

    if (window.location.href.indexOf('screen=place&mode=scavenge') < 0) {
        window.location.assign(game_data.link_base_pure + "place&mode=scavenge");
    }
    var lackadaisicalLooters = document.getElementsByClassName("title")[0].innerHTML;
    var humbleHaulers = document.getElementsByClassName("title")[1].innerHTML;
    var cleverCollectors = document.getElementsByClassName("title")[2].innerHTML;
    var greatGatherers = document.getElementsByClassName("title")[3].innerHTML;
    if (parseFloat(game_data.majorVersion) < 8.177) {
        var scavengeInfo = JSON.parse($('html').find('script:contains("ScavengeScreen")').html().match(/\{.*\:\{.*\:.*\}\}/g)[0]);
        var duration_factor = scavengeInfo[1].duration_factor;
        var duration_exponent = scavengeInfo[1].duration_exponent;
        var duration_initial_seconds = scavengeInfo[1].duration_initial_seconds;
    }
    else {
        var duration_factor = window.ScavengeScreen.village.options[1].base.duration_factor;
        var duration_exponent = window.ScavengeScreen.village.options[1].base.duration_exponent;
        var duration_initial_seconds = window.ScavengeScreen.village.options[1].base.duration_initial_seconds;
    }
    //var loot_factor = scavengeInfo[1].loot_factor




    function setScavTime() {
        //check if duration is preset already
        if ("ScavengeTime" in localStorage) {
            hours = parseInt(localStorage.getItem("ScavengeTime"));

        } else {
            hours = 6;
        }
        localStorage.setItem("ScavengeTime", hours);


    }
    setScavTime();


    if ($('button').length == 0) {

        //create interface and button



        haulCategory = 0;
        localStorage.setItem("haulCategory", haulCategory);
        button = document.createElement("button");
        button.classList.add("btn-confirm-yes");
        button.innerHTML = "Adjust scavenge time";
        button.style.visibility = 'hidden';
        body = document.getElementById("scavenge_screen");
        body.prepend(button);
        scavDiv = document.createElement('div');
        //check if archer world or not, depending on outcome make table with or without archers
        if ($('.units-entry-all[data-unit=archer]').text() != "") {
            htmlString = '<div  ID= scavTable >\
            <table class="scavengeTable" width="15%" style="border: 7px solid rgba(121,0,0,0.71); border-image-slice: 7 7 7 7; border-image-source: url(https://dsen.innogamescdn.com/asset/cf2959e7/graphic/border/frame-gold-red.png);">\
               <tbody>\
                  <tr>\
                     <th style="text-align:center" colspan="13">Select unittypes to scavenge with</th>\
                  </tr>\
                  <tr>\
                     <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="spear"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_spear.png" title="Spear fighter" alt="" class=""></a></th>\
                     <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="sword"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_sword.png" title="Swordsman" alt="" class=""></a></th>\
                     <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="axe"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_axe.png" title="Axeman" alt="" class=""></a></th>\
                     <th style="text-align:center" width="35"><a href="#" cl ass="unit_link" data-unit="archer"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_archer.png" title="Archer" alt="" class=""></a></th>\
                     <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="light"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_light.png" title="Light cavalry" alt="" class=""></a></th>\
                     <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="marcher"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_marcher.png" title="Mounted Archer" alt="" class=""></a></th>\
                     <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="heavy"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_heavy.png" title="Heavy cavalry" alt="" class=""></a></th>\
                     <th style="text-align:center" nowrap>Target runtime</th>\
                     <th style="text-align:center" nowrap>How many times did the script get launched</th>\
                  </tr>\
                  <tr>\
                     <td align="center"><input type="checkbox" ID="spear" name="spear" checked = "checked" ></td>\
                     <td align="center"><input type="checkbox" ID="sword" name="sword" ></td>\
                     <td align="center"><input type="checkbox" ID="axe" name="axe" ></td>\
                     <td align="center"><input type="checkbox" ID="archer" name="archer" ></td>\
                     <td align="center"><input type="checkbox" ID="light" name="light" ></td>\
                     <td align="center"><input type="checkbox" ID="marcher" name="marcher" ></td>\
                     <td align="center"><input type="checkbox" ID="heavy" name="heavy" ></td>\
                     <td ID="runtime" align="center"><input type="text" ID="hours" name="hours" size="4" maxlength="5" align=left > hours</td>\
                     <td id="countScript" align="center"></td>\
               </tbody>\
            </table>\
            </br>\
         </div>\
         ';
        } else {
            htmlString = '<div  ID= scavTable>\
            <table class="scavengeTable" width="15%" style="border: 7px solid rgba(121,0,0,0.71); border-image-slice: 7 7 7 7; border-image-source: url(https://dsen.innogamescdn.com/asset/cf2959e7/graphic/border/frame-gold-red.png);">\
             <tbody>\
                  <tr>\
                     <th style="text-align:center" colspan="11">Select unittypes to scavenge with</th>\
                  </tr>\
                  <tr>\
                     <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="spear"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_spear.png" title="Spear fighter" alt="" class=""></a></th>\
                     <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="sword"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_sword.png" title="Swordsman" alt="" class=""></a></th>\
                     <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="axe"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_axe.png" title="Axeman" alt="" class=""></a></th>\
                     <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="light"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_light.png" title="Light cavalry" alt="" class=""></a></th>\
                     <th style="text-align:center" width="35"><a href="#" class="unit_link" data-unit="heavy"><img src="https://dsen.innogamescdn.com/asset/cf2959e7/graphic/unit/unit_heavy.png" title="Heavy cavalry" alt="" class=""></a></th>\
                     <th style="text-align:center" nowrap>Target runtime</th>\
                     <th style="text-align:center" nowrap>Total uses by everyone</th>\
                  </tr>\
                  <tr>\
                     <td align="center"><input type="checkbox" ID="spear" name="spear"></td>\
                     <td align="center"><input type="checkbox" ID="sword" name="sword" ></td>\
                     <td align="center"><input type="checkbox" ID="axe" name="axe" ></td>\
                     <td align="center"><input type="checkbox" ID="light" name="light" ></td>\
                     <td align="center"><input type="checkbox" ID="heavy" name="heavy" ></td>\
                     <td ID="runtime" align="center"><input type="text" ID="hours" name="hours" size="4" maxlength="5" align=left > hours</td>\
                     <td id="countScript"  align="center"></td>\
               </tbody>\
            </table>\
            </br>\
         </div>\
         ';
        }
        if("checkboxHaulValues" in localStorage){
            haulValueCheckboxes = JSON.parse(localStorage.getItem("checkboxHaulValues"));
        }
        else{
            haulValueCheckboxes = [true,true,true,true];
        }
        for (i = 0; i < $(".border-frame-gold-red").length; i++) {
            cat = document.createElement('div');
            cat.innerHTML = '<div align="center"><h3>Enable</h3><input type="checkbox" ID="haul' + (i + 1) + 'Enabled" ><hr></div>';
            $(".border-frame-gold-red")[i].prepend(cat);
        }
        var checkboxesHaul = $(".border-frame-gold-red :checkbox");
        for(var i = 0; i < checkboxesHaul.length; i++){
            checkboxesHaul[i].checked = haulValueCheckboxes[i];
        }

        scavDiv.innerHTML = htmlString;
        scavenge_screen.prepend(scavDiv.firstChild);

        // how many times script got ran before
        $.post('https://v.tylercamp.me/hc/scavengeSophie');
        $.get('https://v.tylercamp.me/hc/scavengeSophie', function (json) {
            console.log("test");
            count = JSON.parse(json);
            $("#countScript")[0].innerHTML = count;
        });

        document.getElementById("hours").value = hours;
        document.getElementById("hours").addEventListener("change", function () {
            hours = parseInt(document.getElementById("hours").value);
            localStorage.setItem("ScavengeTime", hours);
            haulCategory = 0;
            localStorage.setItem("haulCategory", haulCategory);
            calculateHauls();
            clear();
            setScavTime();
            scavenge();
            document.getElementById("hours").focus();

        });

    }

    if ($(".scavengeTable")[0]) {
        document.getElementById("hours").value = hours;
    }

    checkboxValues = JSON.parse(localStorage.getItem('checkboxValues')) || {}, $checkboxes = $("#scavTable :checkbox");
    $checkboxes.on("change", function () {
        $checkboxes.each(function () {
            checkboxValues[this.id] = this.checked;
        });
        localStorage.setItem("checkboxValues", JSON.stringify(checkboxValues));
        calculateHauls();
        haulCategory = 0;
        localStorage.setItem("haulCategory", haulCategory);
        scavenge();
    });

    checkboxesHaul = $(".border-frame-gold-red :checkbox");

    checkboxesHaul.on("change", function () {
        var checkboxesHaulValue = [];
        checkboxesHaul.each(function(){            
            checkboxesHaulValue.push(this.checked);
        })
        localStorage.setItem("checkboxHaulValues", JSON.stringify(checkboxesHaulValue))
        calculateHauls();
        haulCategory = 0;
        localStorage.setItem("haulCategory", haulCategory);
        scavenge();
    })

    sendButtons = $(".free_send_button")
    sendButtons.on("click", async function() {
        
        var css = 
        `#curtain {
          position: fixed;
          _position: absolute;
          z-index: 99;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          _height: expression(document.body.offsetHeight + "px");
          background: url(curtain.png);
          _background: url(curtain.gif);
        }`;
        var styleSheet = document.createElement("style")
        styleSheet.textContent = css
        document.head.appendChild(styleSheet)
        var curtain = document.body.appendChild( document.createElement('div') );
        curtain.id = "curtain";
        curtain.onkeypress = curtain.onclick = function(){ return false; }
        try {
            await new Promise(r => setTimeout(r, 600));
            calculateHauls();
            //haulCategory = 0;
            //localStorage.setItem("haulCategory", haulCategory);
            scavenge();
        }
        finally {
            curtain.parentNode.removeChild( curtain );
        }
    });

    $.each(checkboxValues, function (key, value) {
        $("#" + key).prop('checked', value);
    });


    if ($(".scavengeTable").length) {
        spears = $('.units-entry-all[data-unit=spear]').text().match(/\((\d+)\)/)[1];
        swords = $('.units-entry-all[data-unit=sword]').text().match(/\((\d+)\)/)[1];
        axes = $('.units-entry-all[data-unit=axe]').text().match(/\((\d+)\)/)[1];
        lightC = $('.units-entry-all[data-unit=light]').text().match(/\((\d+)\)/)[1];
        heavyC = $('.units-entry-all[data-unit=heavy]').text().match(/\((\d+)\)/)[1];
        if ($('.units-entry-all[data-unit=archer]').text() != "") {
            archer = $('.units-entry-all[data-unit=archer]').text().match(/\((\d+)\)/)[1]
        } else archer = 0;

        if ($('.units-entry-all[data-unit=marcher]').text() != "") {
            marcher = $('.units-entry-all[data-unit=marcher]').text().match(/\((\d+)\)/)[1]
        } else marcher = 0;
        checkboxStatus();
    }
    else {
        spears = $('.units-entry-all[data-unit=spear]').text().match(/\((\d+)\)/)[1];
        swords = $('.units-entry-all[data-unit=sword]').text().match(/\((\d+)\)/)[1];
        axes = $('.units-entry-all[data-unit=axe]').text().match(/\((\d+)\)/)[1];
        lightC = $('.units-entry-all[data-unit=light]').text().match(/\((\d+)\)/)[1];
        heavyC = $('.units-entry-all[data-unit=heavy]').text().match(/\((\d+)\)/)[1];
        if ($('.units-entry-all[data-unit=archer]').text() != "") {
            archer = $('.units-entry-all[data-unit=archer]').text().match(/\((\d+)\)/)[1]
        } else archer = 0;

        if ($('.units-entry-all[data-unit=marcher]').text() != "") {
            marcher = $('.units-entry-all[data-unit=marcher]').text().match(/\((\d+)\)/)[1]
        } else marcher = 0;
    }

    function checkboxStatus() {
        if (document.getElementById("spear").checked == false) {
            spears = 0;
            haulcategory = 0;
        }
        if (document.getElementById("sword").checked == false) {
            swords = 0;
            haulcategory = 0;
        }
        if (document.getElementById("axe").checked == false) {
            axes = 0;
            haulcategory = 0;
        }
        if (document.getElementById("light").checked == false) {
            lightC = 0;
            haulcategory = 0;
        }
        if (document.getElementById("heavy").checked == false) {
            heavyC = 0;
            haulcategory = 0;
        }
        if ($('.units-entry-all[data-unit=archer]').text() != "") {
            if (document.getElementById("archer").checked == false) {
                archer = 0;
                haulcategory = 0;
            }
        }
        if ($('.units-entry-all[data-unit=marcher]').text() != "") {
            if (document.getElementById("marcher").checked == false) {
                marcher = 0;
                haulcategory = 0;
            }
        }

    }


    function calculateHauls() {

        checkboxStatus();

        totalLoot = spears * 25 + swords * 15 + axes * 10 + lightC * 80 + heavyC * 50 + archer * 10 + marcher * 50;
        //totalSpSwLoot = spears * 25 + swords * 15;
        possibleLoot = spears * 25 + swords * 15 + axes * 10 + lightC * 80 + heavyC * 50 + archer * 10 + marcher * 50;
        spearRatio = spears / (spears * 25 + swords * 15 + axes * 10 + lightC * 80 + heavyC * 50 + archer * 10 + marcher * 50);
        swordRatio = swords / (spears * 25 + swords * 15 + axes * 10 + lightC * 80 + heavyC * 50 + archer * 10 + marcher * 50);
        axesRatio = axes / (spears * 25 + swords * 15 + axes * 10 + lightC * 80 + heavyC * 50 + archer * 10 + marcher * 50);
        lightCRatio = lightC / (spears * 25 + swords * 15 + axes * 10 + lightC * 80 + heavyC * 50 + archer * 10 + marcher * 50);
        archerRatio = archer / (spears * 25 + swords * 15 + axes * 10 + lightC * 80 + heavyC * 50 + archer * 10 + marcher * 50);
        marcherRatio = marcher / (spears * 25 + swords * 15 + axes * 10 + lightC * 80 + heavyC * 50 + archer * 10 + marcher * 50);
        heavyCRatio = heavyC / (spears * 25 + swords * 15 + axes * 10 + lightC * 80 + heavyC * 50 + archer * 10 + marcher * 50);

        time = hours * 3600;
        haul = ((time / duration_factor - duration_initial_seconds) ** (1 / (duration_exponent)) / 100) ** (1 / 2);
        var enabled = $(".border-frame-gold-red :checkbox");
        totalHaul = 0;
        if (enabled[0].checked){
            haul1 = haul / 0.1;
            totalHaul += haul1;
        } else haul1 = 0
        if (enabled[1].checked){
            haul2 = haul / 0.25;
            totalHaul += haul2;
        } else haul2 = 0
        if (enabled[2].checked){
            haul3 = haul / 0.5;
            totalHaul += haul3;
        } else haul3 = 0
        if (enabled[3].checked){
            haul4 = haul / 0.75;
            totalHaul += haul4;
        } else haul4 = 0
    }
    calculateHauls();

    if ("haulCategory" in localStorage) {
        haulCategory = localStorage.getItem("haulCategory");
    } else {
        haulCategory = 0;
        localStorage.setItem("haulCategory", haulCategory);
    }


    if (totalLoot > totalHaul) {
        haulCategory = 1;
        localStorage.setItem("haulCategory", haulCategory);
    } else {
        if (haulCategory == 0) {
            haulCategory = 3;
            localStorage.setItem("haulCategory", haulCategory);
        }
    }

    var units = [
        {
                type: 'spear',
                count: spears,
                value: 25
            },
            {
                type: 'sword',
                count: swords,
                value: 15
            },
            {
                type: 'axe',
                count: axes,
                value: 10
            },
            {
                type: 'archer',
                count: archer,
                value: 10
            },
            {
                type: 'light',
                count: lightC,
                value: 80
            },
            {
                type: 'marcher',
                count: marcher,
                value: 50
            },
            {
                type: 'heavy',
                count: heavyC,
                value: 50
            },
    ];

    if (haulCategory == 1) {
        scavengeOptions = {};
        scavengeOptions[greatGatherers] = [
            {
                type: 'spear',
                count: (haul4 * spearRatio)
            },
            {
                type: 'sword',
                count: (haul4 * swordRatio)
            },
            {
                type: 'axe',
                count: (haul4 * axesRatio)
            },
            {
                type: 'archer',
                count: (haul4 * archerRatio)
            },
            {
                type: 'light',
                count: (haul4 * lightCRatio)
            },
            {
                type: 'marcher',
                count: (haul4 * marcherRatio)
            },
            {
                type: 'heavy',
                count: (haul4 * heavyCRatio)
            },
        ];
        scavengeOptions[cleverCollectors] = [
            {
                type: 'spear',
                count: (haul3 * spearRatio)
            },
            {
                type: 'sword',
                count: (haul3 * swordRatio)
            },
            {
                type: 'axe',
                count: (haul3 * axesRatio)
            },
            {
                type: 'archer',
                count: (haul3 * archerRatio)
            },
            {
                type: 'light',
                count: (haul3 * lightCRatio)
            },
            {
                type: 'marcher',
                count: (haul3 * marcherRatio)
            },
            {
                type: 'heavy',
                count: (haul3 * heavyCRatio)
            },
        ];
        scavengeOptions[humbleHaulers] = [
            {
                type: 'spear',
                count: (haul2 * spearRatio)
            },
            {
                type: 'sword',
                count: (haul2 * swordRatio)
            },
            {
                type: 'axe',
                count: (haul2 * axesRatio)
            },
            {
                type: 'archer',
                count: (haul2 * archerRatio)
            },
            {
                type: 'light',
                count: (haul2 * lightCRatio)
            },
            {
                type: 'marcher',
                count: (haul2 * marcherRatio)
            },
            {
                type: 'heavy',
                count: (haul2 * heavyCRatio)
            },
        ];
        scavengeOptions[lackadaisicalLooters] = [
            {
                type: 'spear',
                count: (haul1 * spearRatio)
            },
            {
                type: 'sword',
                count: (haul1 * swordRatio)
            },
            {
                type: 'axe',
                count: (haul1 * axesRatio)
            },
            {
                type: 'archer',
                count: (haul1 * archerRatio)
            },
            {
                type: 'light',
                count: (haul1 * lightCRatio)
            },
            {
                type: 'marcher',
                count: (haul2 * marcherRatio)
            },
            {
                type: 'heavy',
                count: (haul1 * heavyCRatio)
            },
        ];

    } else {
        if (haulCategory == 2) {
            scavengeOptions = {};
            scavengeOptions[greatGatherers] = [
                {
                    type: 'spear',
                    count: (haul4 * (spears / possibleLoot))
                },
                {
                    type: 'sword',
                    count: (haul4 * (swords / possibleLoot))
                },
                {
                    type: 'axe',
                    count: (haul4 * (axes / possibleLoot))
                },
                {
                    type: 'light',
                    count: (haul4 * (lightC / possibleLoot))
                },
                {
                    type: 'heavy',
                    count: (haul4 * (heavyC / possibleLoot))
                },
                {
                    type: 'archer',
                    count: (haul4 * (archer / possibleLoot))
                },
                {
                    type: 'marcher',
                    count: (haul4 * (marcher / possibleLoot))
                },
            ];
            scavengeOptions[cleverCollectors] = [
                {
                    type: 'spear',
                    count: (haul3 * (spears / possibleLoot))
                },
                {
                    type: 'sword',
                    count: (haul3 * (swords / possibleLoot))
                },
                {
                    type: 'axe',
                    count: (haul3 * (axes / possibleLoot))
                },
                {
                    type: 'light',
                    count: (haul3 * (lightC / possibleLoot))
                },
                {
                    type: 'heavy',
                    count: (haul3 * (heavyC / possibleLoot))
                },
                {
                    type: 'archer',
                    count: (haul3 * (archer / possibleLoot))
                },
                {
                    type: 'marcher',
                    count: (haul3 * (marcher / possibleLoot))
                },
            ];
            scavengeOptions[humbleHaulers] = [
                {
                    type: 'spear',
                    count: (haul2 * (spears / possibleLoot))
                },
                {
                    type: 'sword',
                    count: (haul2 * (swords / possibleLoot))
                },
                {
                    type: 'axe',
                    count: (haul2 * (axes / possibleLoot))
                },
                {
                    type: 'light',
                    count: (haul2 * (lightC / possibleLoot))
                },
                {
                    type: 'heavy',
                    count: (haul2 * (heavyC / possibleLoot))
                },
                {
                    type: 'archer',
                    count: (haul2 * (archer / possibleLoot))
                },
                {
                    type: 'marcher',
                    count: (haul2 * (marcher / possibleLoot))
                },
            ];
            scavengeOptions[lackadaisicalLooters] = [
                {
                    type: 'spear',
                    count: (haul1 * (spears / possibleLoot))
                },
                {
                    type: 'sword',
                    count: (haul1 * (swords / possibleLoot))
                },
                {
                    type: 'axe',
                    count: (haul1 * (axes / possibleLoot))
                },
                {
                    type: 'light',
                    count: (haul1 * (lightC / possibleLoot))
                },
                {
                    type: 'heavy',
                    count: (haul1 * (heavyC / possibleLoot))
                },
                {
                    type: 'archer',
                    count: (haul1 * (archer / possibleLoot))
                },
                {
                    type: 'marcher',
                    count: (haul1 * (marcher / possibleLoot))
                },
            ];
        } else {
            if (haulCategory == 3) {
                scavengeOptions = {};
                var result = closestCombination((totalLoot / totalHaul * haul4), units)
                scavengeOptions[greatGatherers] = [
                    {
                        type: 'spear',
                        count: result.find(e=>e.type === 'spear').count
                    },
                    {
                        type: 'sword',
                        count: result.find(e=>e.type === 'sword').count
                    },
                    {
                        type: 'axe',
                        count: result.find(e=>e.type === 'axe').count
                    },
                    {
                        type: 'light',
                        count: result.find(e=>e.type === 'light').count
                    },
                    {
                        type: 'heavy',
                        count: result.find(e=>e.type === 'heavy').count
                    },
                    {
                        type: 'archer',
                        count: result.find(e=>e.type === 'archer').count
                    },
                    {
                        type: 'marcher',
                        count: result.find(e=>e.type === 'marcher').count
                    },
                ];
                result = closestCombination((totalLoot / (totalHaul - haul4) * haul3), units)
                scavengeOptions[cleverCollectors] = [
                    {
                        type: 'spear',
                        count: result.find(e=>e.type === 'spear').count
                    },
                    {
                        type: 'sword',
                        count: result.find(e=>e.type === 'sword').count
                    },
                    {
                        type: 'axe',
                        count: result.find(e=>e.type === 'axe').count
                    },
                    {
                        type: 'light',
                        count: result.find(e=>e.type === 'light').count
                    },
                    {
                        type: 'heavy',
                        count: result.find(e=>e.type === 'heavy').count
                    },
                    {
                        type: 'archer',
                        count: result.find(e=>e.type === 'archer').count
                    },
                    {
                        type: 'marcher',
                        count: result.find(e=>e.type === 'marcher').count
                    },
                ];
                result = closestCombination((totalLoot / (totalHaul - haul4 - haul3) * haul2), units)
                scavengeOptions[humbleHaulers] = [
                    {
                        type: 'spear',
                        count: result.find(e=>e.type === 'spear').count
                    },
                    {
                        type: 'sword',
                        count: result.find(e=>e.type === 'sword').count
                    },
                    {
                        type: 'axe',
                        count: result.find(e=>e.type === 'axe').count
                    },
                    {
                        type: 'light',
                        count: result.find(e=>e.type === 'light').count
                    },
                    {
                        type: 'heavy',
                        count: result.find(e=>e.type === 'heavy').count
                    },
                    {
                        type: 'archer',
                        count: result.find(e=>e.type === 'archer').count
                    },
                    {
                        type: 'marcher',
                        count: result.find(e=>e.type === 'marcher').count
                    },
                ];
                result = closestCombination((totalLoot / (totalHaul - haul4 - haul3 - haul2) * haul1), units)
                scavengeOptions[lackadaisicalLooters] = [
                    {
                        type: 'spear',
                        count: result.find(e=>e.type === 'spear').count
                    },
                    {
                        type: 'sword',
                        count: result.find(e=>e.type === 'sword').count
                    },
                    {
                        type: 'axe',
                        count: result.find(e=>e.type === 'axe').count
                    },
                    {
                        type: 'light',
                        count: result.find(e=>e.type === 'light').count
                    },
                    {
                        type: 'heavy',
                        count: result.find(e=>e.type === 'heavy').count
                    },
                    {
                        type: 'archer',
                        count: result.find(e=>e.type === 'archer').count
                    },
                    {
                        type: 'marcher',
                        count: result.find(e=>e.type === 'marcher').count
                    },
                ];
            }
        }
    }

    run();

    function closestCombination(target, types) {
    // Sort the types in descending order of their values
    types.sort((a, b) => b.value - a.value);

    let result = [];
    let remaining = target;

    for (let i = 0; i < types.length; i++) {
        let type = types[i];
        let count = Math.min(Math.floor(remaining / type.value), type.count);
        if (count > 0) {
            remaining -= count * type.value;
            if(remaining === 5 && type.value === 15){
              remaining += type.value
              count -= 1
            }
        }
        result.push({ type: type.type, count: count });
    }

    return result;
}    

    function run() {
        let btn = null;
        for (const option in scavengeOptions) {
            btn = findNextButton(option);

            if (btn) {
                fillInTroops(option, getAvailableUnits(), btn);
                break;
            }
        }
    }

    function clear() {
        let btn = null;
        for (const option in scavengeOptions) {
            btn = findNextButton(option);
            if (btn) {
                emptyTroops(option);
                break;
            }
        }
    }

    function fillInTroops(option, availableUnits, button) {
        scavengeOptions[option].forEach(units => {
            const type = units.type;
            const count = units.count;
            let requiredCapacity = availableUnits[type] < count ? availableUnits[type] : count;

            $(`input.unitsInput[name='${type}']`).val(requiredCapacity).trigger("change");
            $(button).focus();
        });
    }

    function emptyTroops(option) {
        scavengeOptions[option].forEach(units => {
            const type = units.type;
            $(`input.unitsInput[name='${type}']`).val("").trigger("change");
        });
    }

    function findNextButton(option) {
        startButtonName = document.getElementsByClassName("btn btn-default free_send_button")[0].innerHTML;
        let btn = $(`.scavenge-option:contains("${option}")`).find('a:contains(' + startButtonName + ')');
        if (btn.length > 0 && !$(btn).hasClass('btn-disabled')) return btn;
    }


    function getAvailableUnits() {
        let availableUnits = {};

        $('.units-entry-all').each((i, e) => {
            const unitName = $(e).attr("data-unit");
            const count = $(e).text().replace(/[()]/, '');
            availableUnits[unitName] = parseInt(count);
        });
        return availableUnits;
    }


}

scavenge();
