var app = {
    appendToHistory:function(text) {
        $("#history").text(
            $("#history").text() + "\n" + text
        );
    },
    
    fireCommand:function(command) {
        try {
            var result = Big.expression.evalInfix(command);
            
            if (result.length == 1) {
                app.appendToHistory(
                    command + " = " + result[0].toString()
                );
            }
            
            else {
                app.appendToHistory(command);
                app.appendToHistory("error: invalid resulting stack size");
            }
        }
        catch(e) {
            app.appendToHistory(command );
            app.appendToHistory("error: " + e);
        }
    },
    
    setupKeys:function() {
        $("#input").bind("keypress", function() {
            if (window.event.keyCode == 13 && $.trim($("#input").text()).length) {
                
                app.fireCommand(
                    $("#input").text()
                );
                $("#input").text("");
                
                return false;
            }
            
            
        });
    }
};

$(function() {
    

    app.setupKeys();

});