var body = document.getElementById("body");
var table;
var headerNames = ["", "UPs", "TPs", "Personality", "", "", "", "Moves"];
var subHeaderNames = ["Loomian", "HP", "Energy", "Attack", "Defense", "Attack R", "Defense R", "Speed", "HP", "Energy", "Attack", "Defense", "Attack R", "Defense R", "Speed", "1st", "2nd", "3rd", "Ability", "Item", "Level", "Move 1", "Move 2", "Move 3", "Move 4"]
let allElements = [];

function createTable() {
    table = document.createElement("table");
    table.className = "gridtable";

    let thead = document.createElement("thead");
    let tSubHead = document.createElement("thead");
    let tbody = document.createElement("tbody");
    let headerRow = document.createElement("tr");
    let subHeaderRow = document.createElement("tr");

    headerNames.forEach(function (k) {
        let th = document.createElement("th");
        th.appendChild(document.createTextNode(k));
        if (k == "UPs" || k == "TPs") {
            th.colSpan = 7;
        }
        if (k == "Personality") {
            th.colSpan = 3;
        }
        if (k == "Moves") {
            th.colSpan = 4;
        }

        headerRow.appendChild(th);
    });

    subHeaderNames.forEach(function (k) {
        let th = document.createElement("th");
        th.appendChild(document.createTextNode(k));
        subHeaderRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    tSubHead.appendChild(subHeaderRow);
    
    tbody = createTenRows(tbody);

    table.appendChild(thead);
    table.appendChild(tSubHead);
    table.appendChild(tbody);

    body.appendChild(table);

}

function saveSets() {
    let sets = "";

    for (let row in allElements) {
        if (allElements[row][0].value == "None" || allElements[row][0].value == undefined) {
            break;
        }
        let set = createSet(allElements[row]);
        if (row != 0) sets += "\n";
        sets += set;
    }

    document.getElementById("export").value = sets;
    document.getElementById("export").select();
    document.execCommand("copy");
    alert("Copied to clipbord");

    /*if (Object.keys(sets).length != 0) {
        let json = JSON.stringify(sets);
        let pakoStuff = pako.deflate(json, {to: "string"});
        let encoded = btoa(pakoStuff);
        document.getElementById("export").value = json;
        document.getElementById("export").select();
        document.execCommand("copy");
        alert("Copied to clipbord");
    }*/
}
function createSet(row) {
    let set = {};

    set.name = row[0].value;

    set.ivs = {};
    set.ivs.hp = row[1].value;
    set.ivs.energy = row[2].value;
    set.ivs.attack = row[3].value;
    set.ivs.defense = row[4].value;
    set.ivs.attackR = row[5].value;
    set.ivs.defenseR = row[6].value;
    set.ivs.speed = row[7].value;

    set.evs = {};
    set.evs.hp = row[8].value;
    set.evs.energy = row[9].value;
    set.evs.attack = row[10].value;
    set.evs.defense = row[11].value;
    set.evs.attackR = row[12].value;
    set.evs.defenseR = row[13].value;
    set.evs.speed = row[14].value;
    
    set.posNature = row[15].value;
    set.negNature = row[16].value;
    set.veryNature = row[17].value;

    set.ability = row[18].value;
    set.item = row[19].value;
    set.level = row[20].value;

    set.moves = {};
    set.moves.move1 = row[21].value;
    set.moves.move2 = row[22].value;
    set.moves.move3 = row[23].value;
    set.moves.move4 = row[24].value;

    let finalText = set.name;
    if (set.item != "None") finalText += " @ " + set.item;
    finalText += "\n";
    if (set.ability != "None") finalText += "Ability: " + set.ability + "\n";
    let tpsArray = [];
    for (let stat in set.evs) {
        let tp = set.evs[stat] ? set.evs[stat] : 0;
        if (tp > 0) {
            stat = setToCalc(stat.toLowerCase());
            tpsArray.push(tp + " " + stat);
        }
    }
    if (tpsArray.length > 0) {
        finalText += "TPs: ";
        finalText += serialize(tpsArray, " / ");
        finalText += "\n";
    }
    if (set.posNature != "none" || set.negNature != "none" || set.veryNature != "none") {
        finalText += "Personality: ";
        if (set.posNature != "none") finalText += set.posNature.charAt(0).toUpperCase() + set.posNature.slice(1) + ", ";
        if (set.negNature != "none") finalText += set.negNature.charAt(0).toUpperCase() + set.negNature.slice(1) + ", ";
        if (set.veryNature != "none") finalText += set.veryNature.charAt(0).toUpperCase() + "ery " + set.veryNature.charAt(1).toUpperCase() + set.veryNature.slice(2);
        if (set.veryNature == "none") finalText = finalText.slice(0, finalText.length - 2);
        finalText += "\n";
    }   
    let upsArray = [];
    for (let stat in set.ivs) {
        let up = set.ivs[stat] ? set.ivs[stat] : 0;
        if (up < 40) {
            stat = setToCalc(stat.toLowerCase());
            upsArray.push(up + " " + stat);
        }
    }
    if (upsArray.length > 0) {
        finalText += "UPs: ";
        finalText += serialize(upsArray, " / ");
        finalText += "\n";
    }
    if (set.moves.move1 !== "(No Move)") finalText += "- " + set.moves.move1 + "\n";
    if (set.moves.move2 !== "(No Move)") finalText += "- " + set.moves.move2 + "\n";
    if (set.moves.move3 !== "(No Move)") finalText += "- " + set.moves.move3 + "\n";
    if (set.moves.move4 !== "(No Move)") finalText += "- " + set.moves.move4 + "\n";
    
    return finalText;
}

function setToCalc(stat) {
    switch (stat) {
    case 'hp':
        return "HP";
    case 'energy':
        return "Energy";
    case 'attack':
        return "Attack";
    case 'defense':
        return "Defense";
    case 'attackr':
        return "AttackR";
    case 'defenser':
        return "DefenseR";
    case 'speed':
        return "Speed"; 
    }
}

function serialize(array, separator) {
    let text = "";
    for (let i = 0; i < array.length; i++) {
        if (i < array.length - 1) {
            text += array[i] + separator;
        } else text += array[i];
    }
    return text;
}

function createHeader(text) {
    let hr = document.createElement("th");
    hr.innerHTML = text;
    return hr;
}

function createRow() {
    let row = document.createElement("tr");
    let elements = [];

    let pokeDropdown = createPokeDropdown();
    
    let hpEV = createInput(0, 200);
    let energyEV = createInput(0, 200);
    let atkEV = createInput(0, 200);
    let defEV = createInput(0, 200);
    let atkREV = createInput(0, 200);
    let defREV = createInput(0, 200);
    let spdEV = createInput(0, 200);
    hpEV.step = 4;
    energyEV.step = 4;
    atkEV.step = 4;
    defEV.step = 4;
    atkREV.step = 4;
    defREV.step = 4;
    spdEV.step = 4;

    let hpIV = createInput(0, 40);
    let energyIV = createInput(0, 40);
    let atkIV = createInput(0, 40);
    let defIV = createInput(0, 40);
    let atkRIV = createInput(0, 40);
    let defRIV = createInput(0, 40);
    let spdIV = createInput(0, 40);
    
    hpIV.value = 40;
    energyIV.value = 40;
    atkIV.value = 40;
    defIV.value = 40;
    atkRIV.value = 40;
    defRIV.value = 40;
    spdIV.value = 40;

    let posNat = createPosNatureDropdown();
    let negNat = createNegNatureDropdown();
    let veryNat = createVeryNatureDropdown();

    let abilityDropdown = createAbilityDropdown();
    let itemDropdown = createItemyDropdown();

    let level = createInput(1, 100);
    level.value = 50;

    let moveOne = createMoveDropdown();
    let moveTwo = createMoveDropdown();
    let moveThree = createMoveDropdown();
    let moveFour = createMoveDropdown();

    elements.push(pokeDropdown, hpIV, energyIV, atkIV, defIV, atkRIV, defRIV, spdIV, hpEV, energyEV, atkEV, defEV, atkREV, defREV, spdEV);
    elements.push(posNat, negNat, veryNat, abilityDropdown, itemDropdown, level, moveOne, moveTwo, moveThree, moveFour);

    allElements.push(elements);

    for (let element in elements) {
        let td = document.createElement("td");
        td.appendChild(elements[element]);
        row.appendChild(td);
    }
    return row;
}

function createTenRows(tbody) {
    for (let i = 0; i < 7; i++) {
        let newRow = createRow();
        tbody.appendChild(newRow);
    }
    return tbody;
}

function createPokeDropdown() {
    let dropdown = document.createElement("select");
    dropdown.className = "pokeSelect";
    dropdown.options[0] = new Option("None");
    for (let loom in loomians) {
        dropdown.options[dropdown.options.length] = new Option(loomians[loom].name); 
        
    }
    return dropdown;
}

function createMoveDropdown() {
    let dropdown = document.createElement("select");
    let moveNames = [];
    dropdown.className = "moveSelect";

    for (let move in moves) {
        moveNames.push(moves[move].name);
    }

    moveNames.sort();

    for (let move in moveNames) {
        dropdown.options[dropdown.options.length] = new Option(moveNames[move]);
    }

    return dropdown;
}

function createPosNatureDropdown() {
    let dropdown = document.createElement("select");
    
    dropdown.options[0] = new Option("None", "none");
    dropdown.options[1] = new Option("Brawny", "brawny");
    dropdown.options[2] = new Option("Robust", "robust");
    dropdown.options[3] = new Option("Smart", "smart");
    dropdown.options[4] = new Option("Clever", "clever");
    dropdown.options[5] = new Option("Nimble", "nimble");
    dropdown.options[6] = new Option("Hyper", "hyper");
    dropdown.options[7] = new Option("Frail", "frail");
    dropdown.options[8] = new Option("Tender", "tender");
    dropdown.options[9] = new Option("Clumsy", "clumsy");
    dropdown.options[10] = new Option("Foolish", "foolish");
    dropdown.options[11] = new Option("Sluggish", "sluggish");
    dropdown.options[12] = new Option("Dull", "dull");
    dropdown.options[13] = new Option("Indifferent", "indifferent");

    return dropdown;
}

function createNegNatureDropdown() {
    let dropdown = document.createElement("select");
    
    dropdown.options[0] = new Option("None", "none");
    dropdown.options[1] = new Option("Frail", "frail");
    dropdown.options[2] = new Option("Tender", "tender");
    dropdown.options[3] = new Option("Clumsy", "clumsy");
    dropdown.options[4] = new Option("Foolish", "foolish");
    dropdown.options[5] = new Option("Sluggish", "sluggish");
    dropdown.options[6] = new Option("Dull", "dull");
    dropdown.options[7] = new Option("Brawny", "brawny");
    dropdown.options[8] = new Option("Robust", "robust");
    dropdown.options[9] = new Option("Smart", "smart");
    dropdown.options[10] = new Option("Clever", "clever");
    dropdown.options[11] = new Option("Nimble", "nimble");
    dropdown.options[12] = new Option("Hyper", "hyper");
    dropdown.options[13] = new Option("Indifferent", "indifferent");

    return dropdown;
}

function createVeryNatureDropdown() {
    let dropdown = document.createElement("select");
    dropdown.options[0] = new Option("None", "none");
    dropdown.options[1] = new Option("Very Brawny", "vBrawny");
    dropdown.options[2] = new Option("Very Hyper", "vHyper"); 
    dropdown.options[3] = new Option("Very Robust", "vRobust");
    dropdown.options[4] = new Option("Very Smart", "vSmart");
    dropdown.options[5] = new Option("Very Clever", "vClever");
    dropdown.options[6] = new Option("Very Nimble", "vNimble");
    dropdown.options[7] = new Option("Very Frail", "vFrail");
    dropdown.options[8] = new Option("Very Dull", "vDull"); 
    dropdown.options[9] = new Option("Very Tender", "vTender");
    dropdown.options[10] = new Option("Very Clumsy", "vClumsy");
    dropdown.options[11] = new Option("Very Foolish", "vFoolish");
    dropdown.options[12] = new Option("Very Sluggish", "vSluggish");
    
    return dropdown;
}
function createAbilityDropdown() {
    let dropdown = document.createElement("select");

    dropdown.options[0] = new Option("None");
    abilities.sort();

    for (let ability in abilities) {
        dropdown.options[dropdown.options.length] = new Option(abilities[ability]);
    }

    return dropdown;
}

function createItemyDropdown() {
    let dropdown = document.createElement("select");
    
    dropdown.options[0] = new Option("None");
    items.sort();

    for (let item in items) {
        dropdown.options[dropdown.options.length] = new Option(items[item]);
    }

    return dropdown;
}

function createInput(min, max) {
    let input = document.createElement("input");
    input.type = "number";
    input.min = min;
    input.max = max;

    input.addEventListener("keyup", function() {
        input.value = restrict(input.value, input.min, input.max);
    });

    input.value = 0;
    return input;
}

function createTextInput() {
    let input = document.createElement("input");
    input.type = "text";
    input.className = "textInput";
    
    return input;
}

function restrict(value, min, max) {
    if (parseInt(value) < min) {
        return min;
    }
    else if (parseInt(value) > max) {
        return max;
    }

    return value;
}
