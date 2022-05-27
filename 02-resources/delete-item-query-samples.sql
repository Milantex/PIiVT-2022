DELETE FROM `order` WHERE `order`.cart_id IN (
	SELECT
		cart.cart_id
	FROM
		cart
	INNER JOIN cart_content ON cart.cart_id = cart_content.cart_id
	INNER JOIN item_size ON cart_content.item_size_id = item_size.item_size_id
	WHERE
		item_size.item_id = 7
);

DELETE FROM cart_content WHERE cart_content.item_size_id IN (
	SELECT
		item_size_id
	FROM
		item_size
	WHERE
		item_size.item_id = 7
);

DELETE FROM cart WHERE cart.cart_id IN (
	SELECT
		cart.cart_id
	FROM
		cart
	INNER JOIN cart_content ON cart.cart_id = cart_content.cart_id
	INNER JOIN item_size ON cart_content.item_size_id = item_size.item_size_id
	WHERE
		item_size.item_id = 7
);

DELETE FROM item_ingredient WHERE item_id = 7;

DELETE FROM item_size WHERE item_id = 7;

DELETE FROM photo WHERE item_id = 7;

DELETE FROM item WHERE item_id = 7;