$(function () {
    $('#aScomparsa').hide();
    $("fieldset #daCercare").val("");

    $("fieldset #accedi").click(() => {

        $.post("/login", {
            add: $("fieldset #mail2login").val(),
            pass: $("fieldset #pass2login").val(),
        });
    });

    $("fieldset #submitAdd").click(() => {

        var nome = $("fieldset #nome").val()
        var addPosta = $("fieldset #addPosta").val()
        console.log({
            toAdd: nome,
            mail: addPosta
        });

        $.post("/addUser",
            {
                toAdd: nome,
                mail: addPosta
            },
            whenPostDone);
    });

    $("fieldset #submitCerca").click(() => {

        var nome = $("fieldset #daCercare").val()

        $.post("/search",
            {
                toFind: nome
            },
            whenPostDone);
    });


    $("fieldset #submitAll").click(() => {

        $.post("/all", {}, whenPostDone);
    });


    $("#risp1").click(() => {
        $("#oggettoEmail").val("presa visione");
        $("#output").val($("#risp1").val());
    });

    $("#risp2").click(() => {
        $("#oggettoEmail").val("presa visione");
        $("#output").val($("#risp2").val());
    });

    $("#risp3").click(() => {
        $("#oggettoEmail").val("presa visione");
        $("#output").val($("#risp3").val());
    });
});

function generateHTMLCard(nome, mail) {
    return `
    <!--una card-->
    <div class="col-xs" style="background-color:darkcyan" style="margin-right:10px;">
        <div class="row">
            <div class="col-xs" onclick="killme(this);">
                <input class="btn btn-dark" type="button" value="elimina:">
            </div>
            <p class="col-xs">${nome}</p>
            <p style="display:none">${mail}</p>
        </div>
        <div class="row">
            <div class="col-md-2"></div>
            <img class="col-md-8" src="https://www.w3schools.com/howto/img_avatar.png"
                style="width:105px;height:105px">
            <div class="col-md-2"></div>
        </div>
        <div class="row">
            <div class="col-xs" onclick="selectMe(this);">
                <input class="btn btn-dark" type="button" value="selezionami">
            </div>
            <div class="col-xs" onclick="deselectMe(this);">
                <input class="btn btn-dark" type="button" value="togli selezione">
            </div>
        </div>

    </div>
    `;
}

function whenPostDone(receivedData, status) {

    var obj = JSON.parse(receivedData);
    $("#fillMe").html("")

    for (let key in obj) {// itero sull array associativo fatto così: [nome]=mail
        // console.log(obj[key]);
        $("#fillMe").append(generateHTMLCard(key, obj[key]));
    }
}

function killme(chi) {
    let chiDevoEliminare = chi.parentElement.children[1].innerText
    $.post("/rem", { toKill: chiDevoEliminare }, whenPostDone)
    deselectMe(chi)
    $("#daCercare").val("")// ho tizio e caio, se stavo cercando tizio, lo elimino e vedo caio (ma tolgo scritte nel txtbox cerca, sennò si pensa che il cercato è caio se torno dopo un caffè)
}

var selected = []

function selectMe(chi) {

    let toAdd = chi.parentElement.parentElement.children[0].children[2].innerText

    function predicate(ele) {
        return ele == toAdd;
    }

    if (selected.find(predicate) == undefined)//Array.find  Returns the value of the first element in the array where predicate is true, and undefined otherwise.
        selected.push(toAdd)
}

function deselectMe(chi) {
    let torem = chi.parentElement.parentElement.children[0].children[2].innerText
    //delete selected[torem]
    for (let i = 0; i < selected.length; i++) {
        if (selected[i] == torem) {
            selected.splice(i, 1);
            break;
        }
    }
}




function send() {

    if (selected.length > 0) {
        $("#hiddForm [name=arrSerializzato]")[0].value = JSON.stringify(selected);
        $("#hiddForm [name=subject]")[0].value = $("#oggettoEmail").val();
        $("#hiddForm [name=messaggio]")[0].value = $("#output").val();
        $("#hiddForm").submit();
    } else alert("seleziona qualcuno grazie.")

}

var c = "bello"