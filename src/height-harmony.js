function heightHarmony(ehElement){
        var maxHeight = 0;
       
        jQuery(ehElement).each(function() {
            $(this).css("height", "");
            maxHeight = maxHeight > $(this).height() ? maxHeight : $(this).height();
        });

        jQuery(ehElement).height(maxHeight); 
}  