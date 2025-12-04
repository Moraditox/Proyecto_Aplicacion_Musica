CREATE TEMPORARY TABLE IF NOT EXISTS temp_update AS
SELECT 
    id,
    REPLACE(REPLACE(audio_url, 'http://localhost:8000/', 'http://192.168.1.24:8000/'), 'http://127.0.0.1:8000/', 'http://192.168.1.24:8000/') as new_audio_url,
    REPLACE(REPLACE(cover_url, 'http://localhost:8000/', 'http://192.168.1.24:8000/'), 'http://127.0.0.1:8000/', 'http://192.168.1.24:8000/') as new_cover_url
FROM songs
WHERE audio_url LIKE '%localhost%' OR audio_url LIKE '%127.0.0.1%' OR cover_url LIKE '%localhost%' OR cover_url LIKE '%127.0.0.1%';

UPDATE songs
SET 
    audio_url = (SELECT new_audio_url FROM temp_update WHERE temp_update.id = songs.id),
    cover_url = (SELECT new_cover_url FROM temp_update WHERE temp_update.id = songs.id)
WHERE id IN (SELECT id FROM temp_update);

DROP TABLE IF EXISTS temp_update;
