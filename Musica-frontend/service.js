import TrackPlayer, { Event } from 'react-native-track-player';

export async function PlaybackService() {
    TrackPlayer.addEventListener(Event.RemotePlay, () => {
        TrackPlayer.play();
    });

    TrackPlayer.addEventListener(Event.RemotePause, () => {
        TrackPlayer.pause();
    });

    TrackPlayer.addEventListener(Event.RemoteNext, () => {
        TrackPlayer.skipToNext();
    });

    TrackPlayer.addEventListener(Event.RemotePrevious, () => {
        TrackPlayer.skipToPrevious();
    });

    TrackPlayer.addEventListener(Event.RemoteSeek, ({ position }) => {
        TrackPlayer.seekTo(position);
    });

    TrackPlayer.addEventListener(Event.RemoteStop, () => {
        TrackPlayer.stop();
    });

    TrackPlayer.addEventListener(Event.RemoteDuck, async ({ paused, permanent }) => {
        if (permanent) {
            TrackPlayer.pause();
        } else if (paused) {
            TrackPlayer.pause();
        } else {
            TrackPlayer.play();
        }
    });
}
