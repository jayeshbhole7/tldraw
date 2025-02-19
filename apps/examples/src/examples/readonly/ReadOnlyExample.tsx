import { Tldraw } from '@tldraw/tldraw'
import '@tldraw/tldraw/tldraw.css'

export default function ReadOnlyExample() {
	return (
		<div className="tldraw__editor">
			<Tldraw
				persistenceKey="tldraw_example"
				onMount={(editor) => {
					editor.updateInstanceState({ isReadonly: true })
				}}
			/>
		</div>
	)
}

/* 
This example shows how to make the editor read-only. We use the `onMount` prop to
set the editor's `isReadonly` state to `true`. This will disable all editing
functionality and show only the select tool, hand tool and laser pointer on the
toolbar.
*/
