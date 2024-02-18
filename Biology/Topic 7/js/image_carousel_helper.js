// console.log("Transmembrane Image Carousel");
var cdnLocation = "https://cdn.rcsb.org";
var hdImagesLocation = cdnLocation + "/images/hd/";
var windowUrl = window.location.search;

$(function() {
    $('#carousel-structuregallery').carousel({
        interval: false
    });

    if ($("#carousel-structuregallery .imageCarouselItem").length === 1) {
        $("#Carousel-BiologicalUnit0").addClass("active");
    } else {
        let unitOneHTML = $("#Carousel-BiologicalUnit0 .carousel-header").html();
        if (unitOneHTML.includes("NMR Ensemble")) {
            $("#Carousel-BiologicalUnit0").addClass("active");
        } else {
            $("#Carousel-BiologicalUnit1").addClass("active");
        }
    }
    
    loadRegularImages(structureId.toLowerCase());

    // jump to correspond carousel image section from search results page RBT-990
    // - TODO this is giving console error becsuse 'finalImageCount' is not in scope
    if (finalImageCount) {
        for(var i = 0; i < finalImageCount; i++){
            let str = "?assembly_id=" + i;
            if (windowUrl == str) {
                $(".imageCarouselItem.active").removeClass("active");
                $(".imageCarouselItem.active.ShortGallery").removeClass("active");
                $("#Carousel-BiologicalUnit"+ i).addClass("active");
            }
        }
    }
});

function loadRegularImages (pdbId) {
    // var countItemCarousel = $("#carousel-structuregallery .item").length;

    var imageURL = "";
    for (var i = 0; i <= finalImageCount; i++) {
        // 0 = Asymmetric; 1+ = Biological Assembly

        var pdbIdLc = pdbId.toLowerCase()
        imageURL = RC.MOLSTAR_IMG_URL + pdbIdLc
        if (i === 0) {
            imageURL += (isNMR && modelCount > 1) ? '_models.jpeg' : '_model-1.jpeg'
        } else {
                assemblies.forEach( (assemblyId, index_aseemblyId) => { 
                    if (i == index_aseemblyId + 1) {
                        imageURL += '_assembly-' + assemblyId  + '.jpeg';
                    } 
                })
            }

        // Insert original image into Carousel
        $("#Carousel-BiologicalUnit" + i + " img").attr("src", imageURL);
        $("#Carousel-BiologicalUnit" + i + " .btn-enlargeImage").attr("href", imageURL);
    }

    // If it's just one item, remove the carousel controls
    if ($("#carousel-structuregallery .imageCarouselItem").length === 1) {
        $("#carousel-structuregallery .carousel-control").remove();
    }

    // Remove Chimera Related containers
    $("#carousel-structuregallery .galleryNewImages").remove();

}

$(document).on('click', '.galleryimg img', function () {
    var imageURL = $(this).attr('src');
    var imageLegendText = $(this).attr('alt');

    var parentID = $(this).closest('.imageCarouselItem').attr('id');

    // Remove Active class, then add Active class to selected
    $("#" + parentID + " .galleryimg img").removeClass("active");
    $(this).addClass("active");

    var selectButtonEnlarge = "#" + parentID + " .btn-enlargeImage";
    var selectMainImage = "#" + parentID + " .mainImage";
    var lastMainImage = "#" + parentID + " .mainImage:last";

    // Reset the title span, remove the alt tag of main image
    $("#" + parentID + " .legendTitleContainer").remove();

    var trunkatedName = imageURL.substring(0,imageURL.length - 9);
    var finalurl1000 = trunkatedName + "1000_1000.png";
    var finalurl350 = trunkatedName + "350_350.png";

    var imageLegendAddToMainImage = "";
    if (imageLegendText !== undefined) {
        imageLegendAddToMainImage =  "<span class='text-center legendTitleContainer'>" + imageLegendText + "</span>";
    }

    var creationOfNewImage = "<img src='" + finalurl350 + "' class='img-responsive center-block mainImage'>";

    $(selectMainImage).hide();

    // Do not reload images already clicked on
    var imageAlreadyExist = false;
    $(selectMainImage).each(function() {
        if (this.src == finalurl350) {
            imageAlreadyExist = true;
            $(this).show();
        }
    });
    // On demand, retrieve image from server - lazy load
    if (imageAlreadyExist == false) {
        $("#" + parentID).prepend(creationOfNewImage);
    }


    $(selectButtonEnlarge).prop("data-title", false);
    $(selectButtonEnlarge).removeData('title');

    var downloadbutton = "<br><a role='button' class='btn btn-primary btn-xs' href='" + finalurl1000 + "'>Download High Resolution Image</a>";

    $(imageLegendAddToMainImage).insertAfter(lastMainImage);
    $(selectButtonEnlarge).attr("href", finalurl1000);
    $(selectButtonEnlarge).attr("data-title", finalurl1000 + downloadbutton);
    $(selectButtonEnlarge).data('title');
});
