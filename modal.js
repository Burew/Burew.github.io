window.onload = function(){ //only run after stuff loaded
	
	function adjustSize(){
		// Get the modal
		var modal = document.getElementById('myModal');
		var modalContent = document.getElementById('right-panel');
		var modalExitButton = document.getElementById("close");
		
		if ($(window).width() <= 767) {
			
			// Window is smaller than 767 pixels wide, make modal
			console.log("Changed to modal settings");
			
			modal.className = "modal";
			modalContent.className = "modal-content";
			modalExitButton.style.display = "inline";
			
			// Get the button that opens the modal
			var btn = document.getElementById('navigateButton');

			// Get the <span> element that closes the modal
			//var span = document.getElementsByClassName("close")[0];

			// When the user clicks the button, open the modal 
			btn.onclick = function() {
			modal.style.display = "block";
			}

			// When the user clicks on <span> (x), close the modal
			modalExitButton.onclick = function() {
			modal.style.display = "none";
			} 
			

			// When the user clicks anywhere outside of the modal, close it
			window.onclick = function(event) {
				if (event.target == modal) {
					modal.style.display = "none";
				}
			}

		} 
		else {
			console.log("Changed back to bigger settings");
			
			//reset modal to initial settings
			modal.className = "col-sm-3";
			modalContent.classList.remove("modal-content");
			modalExitButton.style.display = "none";
			
		}
		return;
	}
	
	//adjust size in the beginning
	adjustSize();
	
	//adjust when resizing window
	$(window).resize(function() {	
		adjustSize();
	});

}