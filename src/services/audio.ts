// audio handler for native audio with fallback for html5 audio

import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
// import { NativeAudio } from 'ionic-native';
import { Config } from '../app/config';
import { NativeAudio } from '@ionic-native/native-audio';
@Injectable()
export class AudioService {
	ready = null;
	audio = []
	volume = .4

	constructor(private nativeAudio: NativeAudio,public platform: Platform) {

		this.ready = new Promise((resolve, reject) => {

			// promise that only fires after all files have loaded
			platform.ready().then(() => {
				let files = ['login','message-received-back','message-received-front','message-sent','calling'];
				let c = 1;

				if (this.platform.is('cordova')) {
					files.forEach(file => {
						nativeAudio.preloadComplex(file, 'assets/audio/' + file + '.mp3', this.volume, 1, 0).then(msg => {
							c++;
							if (c == files.length) {
								setTimeout(resolve, 100);
							}	
							console.log(file)
						}, msg => {
							reject('failed to load audio');
							console.debug('ERROR loading sound: ' + msg);
						});
					});
				} else {
					files.forEach(file => {
						this.audio[file] = new Audio('assets/audio/' + file + '.mp3');
						this.audio[file].volume = this.volume;
						console.log(file,this.audio[file])
					});
					resolve();
				}
			});
		});

		this.ready.then(() => {
			console.debug('Audio initilized.');
		});
	}

	// play an audio clip
	public play(clip) {
		if (!Config.audio) {
			return;
		}
		this.ready.then(() => {
			if (this.platform.is('cordova')) {

				this.nativeAudio.loop(clip);
			
				
			} else if (this.audio[clip]) {

				this.audio[clip].play();
			}
		});
	}
	public pause(clip) {
		if (!Config.audio) {
			return;
		}
		this.ready.then(() => {
			if (this.platform.is('cordova')) {

				this.nativeAudio.stop(clip);
			
				
			} else if (this.audio[clip]) {

				this.audio[clip].stop();
			}
		});
	}
}