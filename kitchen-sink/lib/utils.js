export const wait = async(ms) => {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
};

export const normalize = (str) => str.toLowerCase().replace(/[^\w]+/g, "").trim();
