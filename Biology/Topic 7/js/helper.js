/**
 * Helper function to get values out of the URL
 */
function getQueryVariable(variable) {
    var urlSection = window.location.search.substring(1);
    if (typeof urlSection !== "undefined") {
        var vars = urlSection.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
    }
}

function handleLigandDownload(){
    var asym_ids = document.getElementById('labelAsymId').value
    var type = document.getElementById('type').value
    location.href=`https://models.rcsb.org/v1/${structureId.toLowerCase()}/ligand?auth_seq_id=114&label_asym_id=${asym_ids}&encoding=${type}`
}

// Polyfill String.prototype.endsWith()
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        var subjectString = this.toString();
        if (
            typeof position !== "number" ||
            !isFinite(position) ||
            Math.floor(position) !== position ||
            position > subjectString.length
        ) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.lastIndexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}

function findObjectInArrayByKey(key, key_value, array) {
    // Returns an array with that specific object
    return array.filter(function (obj) {
        return obj[key] === key_value;
    });
}

// Check to see if image exist or not
function urlExists(testUrl) {
    var http = jQuery.ajax({
        type: "HEAD",
        url: testUrl,
        async: false,
        cache: true
    });
    return http.status;
    // this will return 200 on success, and 0 or negative value on error
}

// Check to see if Poseview image exist or not
function imageExistsPoseView(structureId, ligandId) {
    var poseViewStatus = $.ajax({
        async: false,
        dataType: "json",
        type: "get",
        url: "/structure/poseview/" + structureId + "-" + ligandId
    });

    return poseViewStatus.responseJSON.poseView_img_status;
}

$(document).on("mouseenter", ".ellipsisToolTip", function () {
    var $this = $(this);

    if (this.offsetWidth < this.scrollWidth && !$this.attr("title")) {
        $this.tooltip({
            title: $this.text(),
            placement: "right"
        });

        $this.tooltip("show");
    }
});

$(function () {
    var windowUrl = window.location.href;

    // Variables from summary.pug. For MACROMOLECULE SECTION
    if (proteinNumber > 0 && nonProteinNumber > 0 && windowUrl.includes("na")) {
        $("#MacromoleculesButton_Proteins").removeClass("active");
        $("#MacromoleculesButton_NucleicAcids").addClass("active");
        $("#MacromoleculeTable").hide();
        $("#MacromoleculeTableDNA").show();
    }
    if (proteinNumber > 0 && nonProteinNumber > 0 && !windowUrl.includes("na")) {
        $("#MacromoleculeTableDNA").hide();
        $("#MacromoleculeTable").show();
    }
    if (proteinNumber > 0 && (nonProteinNumber = 0)) {
        $("#MacromoleculeTableDNA").hide();
        $("#MacromoleculeTable").show();
    }

    if ((proteinNumber = 0) && nonProteinNumber > 0) {
        $("#MacromoleculeTableDNA").show();
        $("#MacromoleculeTable").hide();
    }

    $("#MacromoleculesButton_Proteins").on("click", function () {
        //console.log("Macromolecule Section Proteins");
        $("#MacromoleculesButton_NucleicAcids").removeClass("active");
        $("#MacromoleculesButton_Proteins").addClass("active");
        $("#MacromoleculeTableDNA").hide();
        $("#MacromoleculeTable").show();
    });

    $("#MacromoleculesButton_NucleicAcids").on("click", function () {
        //console.log("Macromolecule Section Nucleic Acid");
        $("#MacromoleculesButton_Proteins").removeClass("active");
        $("#MacromoleculesButton_NucleicAcids").addClass("active");
        $("#MacromoleculeTable").hide();
        $("#MacromoleculeTableDNA").show();
    });

    // Tooltip activation
    $('[data-toggle="tooltip"]').tooltip();

    // show/hide Local Symmetry under image carausole 
    $("#symmetryFull").hide();
    $("#symmetryFull").removeClass("hide");

    $("#full_symmetry_show").on("click", function () {
        $("#symmetryPart").hide();
        $("#symmetryFull").show();
    })
    $("#full_symmetry_hide").on("click", function () {
        $("#symmetryFull" ).hide();
        $("#symmetryPart").show();
    });

    // STRUCTURE SUMMARY - Abstract Section
    $("#abstractFull").hide();
    $("#abstractFull").removeClass("hide");
    
    $("#FullAbstract_Show").on("click", function () {
        $("#abstractPart").hide();
        $("#abstractFull").show();
    });

    $("#FullAbstract_Hide").on("click", function () {
        $("#abstractFull").hide();
        $("#abstractPart").show();
    });

    // show/hide asym ids at macromolecule section SSP
    for(var i= 0; i < 999; i++ ){
        $("#asymFull_" + i).hide();
        $("#asymFull_" + i).removeClass("hide");

        // Show Full Asym 
        $("#full_asym_show_" + i).on("click", function () {
            $("#asymPart_" + this.i).hide();
            $("#asymFull_" + this.i).show();
        }.bind({i:i}))

        // Hide Full Asym
        $("#full_asym_hide_" + i).on("click", function () {
            $("#asymFull_" + this.i).hide();
            $("#asymPart_" + this.i).show();
        }.bind({i:i}))
    }

    // STRUCTURE SUMMARY - Gene Names
    for(var i= 0; i < 99; i++ ){
        $("#geneFull_" + i).hide();
        $("#geneFull_" + i).removeClass("hide");

        // Show Gene Names  Div
        $("#FullGene_Show_" + i).on("click", function () {
            $("#genePart_" + this.i).hide();
            $("#geneFull_" + this.i).show();
        }.bind({i:i}))

        // Hide Gene Names  Div
        $("#FullGene_Hide_" + i).on("click", function () {
            $("#geneFull_" + this.i).hide();
            $("#genePart_" + this.i).show();
        }.bind({i:i}))
    }
});