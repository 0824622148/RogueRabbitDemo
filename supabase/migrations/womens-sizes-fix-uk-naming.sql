-- CORRECTION: live inventory uses "UK" naming, not "US".
-- Undo the mistaken 'US 3' row, remove UK 11, add UK 3, renumber UK 3..UK 10 -> 1..8.

-- 1) remove the mislabeled row added earlier
delete from inventory where gender = 'F' and size_value = 'US 3';

-- 2) remove women's size 11
delete from inventory where gender = 'F' and size_value = 'UK 11';

-- 3) add women's UK 3 for every colourway (no-op if it already exists)
insert into inventory (colourway_id, gender, size_value, in_stock, sort_order)
select c.id, 'F', 'UK 3', true, 1
from colourways c
on conflict (colourway_id, gender, size_value) do nothing;

-- 4) renumber sort_order so women's reads UK 3..UK 10 in order
update inventory set sort_order = 1 where gender = 'F' and size_value = 'UK 3';
update inventory set sort_order = 2 where gender = 'F' and size_value = 'UK 4';
update inventory set sort_order = 3 where gender = 'F' and size_value = 'UK 5';
update inventory set sort_order = 4 where gender = 'F' and size_value = 'UK 6';
update inventory set sort_order = 5 where gender = 'F' and size_value = 'UK 7';
update inventory set sort_order = 6 where gender = 'F' and size_value = 'UK 8';
update inventory set sort_order = 7 where gender = 'F' and size_value = 'UK 9';
update inventory set sort_order = 8 where gender = 'F' and size_value = 'UK 10';
