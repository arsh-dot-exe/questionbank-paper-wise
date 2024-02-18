function insertPoseViewImageContainer(structureId,ligandId,thumbnailUrl,largeUrl,poseViewContainer) {
    var htmlPoseView = "<a data-toggle='modal' data-target='#poseview-modal-"+ligandId+"'><img class='poseviewImage img-thumbnail pull-left' src='"+thumbnailUrl+"'/></a>";
    var poseViewModal = "<div class='modal fade' id='poseview-modal-"+ligandId+"'><div class='modal-dialog' role='document'><div class='modal-content'><div class='modal-header'><button type='button' class='close' data-dismiss='modal'><span>&times;</span></button><h4 class='modal-title'>Poseview Image of "+ligandId+" in "+structureId.toUpperCase() +"</h4></div><div class='modal-body'><img style='width:565px;' src='"+largeUrl+"'><hr>" +
        "<h4>Help</h4><p>Black dashed lines indicate hydrogen bonds, salt bridges, and metal interactions. Green solid line show hydrophobic interactions and green dashed lines show π-π and π-cation interactions.</p><h4>Source Information</h4><p>Interactions are determined by geometric criteria as described in K. Stierand, M. Rarey (2010),Drawing the PDB: Protein-ligand complexes in two dimensions, ACS Med. Chem. Lett., DOI: <a href='http://dx.doi.org/10.1021/ml100164p' target='_blank'>10.1021/ml100164p</a>. Ions and some metal complexes are excluded, as well as cases where no interaction profile could be generated. Poseview diagrams can be calculated for approximately 92% of the remaining complexes in the PDB.</p><p><a href='http://poseview.zbh.uni-hamburg.de' target='_blank'>PoseView</a> is developed at the <a href='http://www.zbh.uni-hamburg.de' target='_blank'>Center for Bioinformatics Hamburg</a> and jointly provided with <a href='http://www.biosolveit.de' target='_blank' >BioSolveIT</a> as a community service at the PDB. A <a href='http://www.biosolveit.de/poseview' target='_blank'>stand-alone version</a> is provided by BioSolveIT.</p></div></div></div></div>";

    $("#" + poseViewContainer).html(htmlPoseView + poseViewModal);
}

function loadPoseViewImage(poseviewID) {

    var poseViewArray = poseviewID.split("-");
    var structureId = poseViewArray[1];
    var ligandId = poseViewArray[2];

    var poseViewURL_fragment = "https://cdn.rcsb.org/etl/poseview/img/" + structureId.toLowerCase().substring(1,3) + "/" + structureId.toLowerCase() + "/" + ligandId[0] + "/" + ligandId.toUpperCase() + "/" + structureId.toLowerCase() + "_" + ligandId.toUpperCase();
    var postViewURL_thumbnail = poseViewURL_fragment + "_100.png";
    var poseViewURL_large =  poseViewURL_fragment + ".png";

    if( imageExistsPoseView(structureId,ligandId) === 200) {
         //console.info("PoseView exist for " + ligandId + " interacting with " + structureId);
        insertPoseViewImageContainer(structureId,ligandId,postViewURL_thumbnail,poseViewURL_large,poseviewID);
    } else {
         //console.info("Container with ID: " + poseviewID + " does NOT have poseView Image for " + ligandId + " interacting with " + structureId);
    }
}

$(function() {
    $("#LigandsTable .poseviewImageWrapper").each(function(){
        var poseViewContainerID = $(this).attr('id');
        loadPoseViewImage(poseViewContainerID);
        //console.log("%%%%poseViewContainerID%%%", poseViewContainerID)
    });
});